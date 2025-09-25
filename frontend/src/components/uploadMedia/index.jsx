import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { auth, storage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import getThumbnail from '@/utils/getThumbnail';

/**
 * 可复用的上传组件（Firebase Storage）：
 * - 主文件路径：forms/<formId>/images/<uid>/<fileName>
 * - 缩略图（视频）路径：forms/<formId>/images/<uid>/thumbnails/<fileName>.jpg
 *   （与 storage.rules: match /forms/{formId}/images/{uid}/{allPaths=**} 完全一致）
 */
export default function UploadMedia({
  value = [],                 // 数组：多文件
  onChange = () => {},
  accept = 'image/*,video/*', // 同时支持图片与视频
  listType = 'picture',
  maxCount = 50,              // 允许最多 50 个（需要更多就调大）
  maxSizeMB = 10,             // 单个文件不超过 10MB
  formId,
}) {
  const [fileList, setFileList] = useState([]);
  // 始终拿到「最新」的 value，避免闭包里读到旧值导致覆盖
  const valueRef = useRef(value);
  useEffect(() => { valueRef.current = value || []; }, [value]);
  
  // 受控：外部 value -> antd fileList
  // 使用浅比较来避免频繁的序列化，只在数组长度或内容真正变化时更新
  const prevValueRef = useRef();
  
  useEffect(() => {
    console.log("value:",value)
    const normalizedValue = Array.isArray(value) ? value : [];
    const prevValue = prevValueRef.current;
    
    // 浅比较：检查数组长度和基本属性是否相同
    if (prevValue && 
        Array.isArray(prevValue) && 
        prevValue.length === normalizedValue.length &&
        prevValue.every((item, index) => {
          const current = normalizedValue[index];
          return item && current && 
                 item.name === current.name && 
                 item.downloadURL === current.downloadURL &&
                 item.thumbnailURL === current.thumbnailURL;
        })) {
      return; // 没有实际变化，跳过更新
    }
    
    setFileList(
      normalizedValue.map((it, idx) => ({
        uid: it.uid || String(idx),
        name: it.name,
        status: 'done',
        url: it.downloadURL || it.url,
        thumbUrl: it.thumbnailURL || it.thumbUrl,
      }))
    );
    
    prevValueRef.current = normalizedValue;
  }, [value]);

  const trigger = (next) => {
    onChange(next.map(it => ({
      name: it.name,
      downloadURL: it.downloadURL || it.url,
      thumbnailURL: it.thumbnailURL || it.thumbUrl,
      size: it.size,
      type: it.type,
      uid: it.uid || undefined,
    })));
  };

  const beforeUpload = (file) => {
    // 与 storage.rules 一致：MIME 或 扩展名兜底
    const okType =
      (file.type && (file.type.startsWith('image/') || file.type.startsWith('video/'))) ||
      /\.(jpg|jpeg|png|gif|webp|mp4|mov|webm)$/i.test(file.name || '');
 
    if (!okType) {
      message.error('Only image or video files are allowed');
      return Upload.LIST_IGNORE;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      message.error(`Each file must be ≤ ${maxSizeMB}MB`);
      return Upload.LIST_IGNORE;
    }
    if (!auth.currentUser) {
      message.error('Please sign in first');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const customRequest = async ({ file, onProgress, onError, onSuccess }) => {
    try {
      if (!auth.currentUser) throw new Error('not-signed-in');
      const uid = auth.currentUser.uid;
      const safeName = String(file.name || 'file').replace(/[^\w.\-]+/g, '_');
      const theFormId = formId || 'temp';

      // 主文件上传：forms/<formId>/images/<uid>/<fileName>
      const objectPath = `forms/${theFormId}/images/${uid}/${safeName}`;
      const fileRef = ref(storage, objectPath);
      
      // 传入明确的 contentType，避免浏览器/环境不给 MIME 导致规则中 .matches() 报 null 错
      const metadata = {
        contentType: file.type || 'application/octet-stream',
        cacheControl: 'public,max-age=3600',
        customMetadata: { owner: uid },
      };
      const task = uploadBytesResumable(fileRef, file, metadata);
      task.on('state_changed', (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.({ percent: pct });
      });

      await task;
      const downloadURL = await getDownloadURL(fileRef);

      let thumbUrl;
      let thumbPath;
      if (file.type?.startsWith('video/')) {
        // 生成视频缩略图
        const thumbBlob = await getThumbnail(file, { frameTime: 0.2 });
        // 缩略图也放在同一 uid 目录下，继承相同的访问控制
        thumbPath = `forms/${theFormId}/images/${uid}/thumbnails/${safeName}.jpg`;
        const thumbRef = ref(storage, thumbPath);
        const thumbTask = uploadBytesResumable(thumbRef, thumbBlob, {
          contentType: 'image/jpeg',
          customMetadata: { owner: uid },
        });
        await thumbTask;
        thumbUrl = await getDownloadURL(thumbRef);
      }

      const meta = {
        name: safeName,
        size: file.size,
        type: file.type,
        downloadURL,
        thumbnailURL: thumbUrl,
        // 记录存储路径，删除时才知道删哪一个
        path: objectPath,
        thumbnailPath: thumbPath,
      };

      
      // 用最新的 valueRef 合并，避免第二次上传把第一次的文件“丢掉”
      const base = Array.isArray(valueRef.current) ? valueRef.current : [];
      const next = [...base, meta];
      trigger(next);
      onSuccess?.(meta);
    } catch (e) {
      console.error(e);
      message.error(e?.message || 'Upload failed');
      onError?.(e);
    }
  };

  return (
    <Upload.Dragger
      multiple
      accept={accept}
      fileList={fileList}
      listType={listType}
      maxCount={maxCount}
      beforeUpload={beforeUpload}
      customRequest={customRequest}
      onRemove={(file) => {
        // 真正删除云端对象（主文件 & 缩略图），规则会校验 owner
        const base = Array.isArray(valueRef.current) ? valueRef.current : [];
        const target = base.find(
          (it) => it.name === file.name && (it.downloadURL || it.url) === (file.url || file.response?.downloadURL)
        );
        const tasks = [];
        if (target?.path) tasks.push(deleteObject(ref(storage, target.path)));
        if (target?.thumbnailPath) tasks.push(deleteObject(ref(storage, target.thumbnailPath)));
        return Promise.all(tasks)
          .catch(() => void 0)
          .finally(() => {
            const next = base.filter((it) => it !== target);
            trigger(next);
          });
      }}
      onChange={({ fileList: fl }) => setFileList(fl)} // 仅控制展示
      showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag image/video here (≤ {maxSizeMB}MB each)
      </p>
    </Upload.Dragger>
  );
}