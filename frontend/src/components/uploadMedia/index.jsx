// frontend/src/components/uploadMedia/index.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { auth, storage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import getThumbnail from '@/utils/getThumbnail';

/**
 * 可复用的上传组件（Firebase Storage）：
 * - 主文件路径：forms/<formId>/images/<fileName>
 * - 缩略图（视频）路径：forms/<formId>/images/thumbnails/<fileName>.jpg
 *   （与 storage.rules 中的 `match /forms/{formId}/images/{allPaths=**}` 兼容）
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
  useEffect(() => {
    setFileList(
      (value || []).map((it, idx) => ({
        uid: it.uid || String(idx),
        name: it.name,
        status: 'done',
        url: it.downloadURL || it.url,
        thumbUrl: it.thumbnailURL || it.thumbUrl,
      }))
    );
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
    const okType = file.type?.startsWith('image/') || file.type?.startsWith('video/');
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
      const safeName = String(file.name || 'file').replace(/[^\w.\-]+/g, '_');
      const theFormId = formId || 'temp';

      // 主文件上传：forms/<formId>/images/<fileName>
      const fileRef = ref(storage, `forms/${theFormId}/images/${safeName}`);
      const task = uploadBytesResumable(fileRef, file);

      task.on('state_changed', (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.({ percent: pct });
      });

      await task;
      const downloadURL = await getDownloadURL(fileRef);

      let thumbUrl;
      if (file.type?.startsWith('video/')) {
        // 生成视频缩略图
        const thumbBlob = await getThumbnail(file, { frameTime: 0.2 });
        const thumbRef = ref(storage, `forms/${theFormId}/images/thumbnails/${safeName}.jpg`);
        const thumbTask = uploadBytesResumable(thumbRef, thumbBlob, { contentType: 'image/jpeg' });
        await thumbTask;
        thumbUrl = await getDownloadURL(thumbRef);
      }

      const meta = {
        name: safeName,
        size: file.size,
        type: file.type,
        downloadURL,
        thumbnailURL: thumbUrl,
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
        const base = Array.isArray(valueRef.current) ? valueRef.current : [];
        const next = base.filter(
          (it) => it.name !== file.name || (it.downloadURL || it.url) !== (file.url || file.response?.downloadURL)
        );
        trigger(next);
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
