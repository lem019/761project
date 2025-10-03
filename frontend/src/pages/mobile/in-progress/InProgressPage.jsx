import React, { useMemo, useState, useEffect } from "react";
import { Input, Empty, Space, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import InProgressCard from "./InProgressCard";
import { getFormList } from "@/services/form-service";
import styles from "./InProgressPage.module.less";

const FILTERS = ["ALL", "Draft", "Pending", "Declined"];

// 状态映射
const statusMap = {
  'draft': 'Draft',
  'pending': 'Pending', 
  'declined': 'Declined',
  'approved': 'Approved'
};

export default function InProgressPage() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [formList, setFormList] = useState([]);

  // 获取表单列表数据
  const fetchFormList = async () => {
    try {
      setLoading(true);

      const status = filter === "ALL" ? "draft,pending,declined" : filter.toLowerCase();

      const params = { status, page: 1, pageSize: 20, viewMode: 'inspector' };
      if (q && q.trim()) params.qFormName = q.trim();
      const response = await getFormList(params);
      
      if (response) {
        setFormList(response.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch form list:', error);
      message.error('Failed to fetch form list');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和筛选条件变化时重新获取数据
  useEffect(() => {
    fetchFormList();
  }, [filter]);

  const filtered = useMemo(() => {
    let rows = formList.map(item => ({
      id: item.id,
      title: item.templateName || 'Unknown Form',
      date: item.createdAt || '',
      status: statusMap[item.status] || item.status,
      templateId: item.templateId || 'pmr',
      formData: item
    }));

    // 客户端搜索过滤 todo 后续更改成服务端
    if (q.trim()) {
      const searchTerm = q.toLowerCase();
      rows = rows.filter(item =>
        [item.id, item.title].join(" ").toLowerCase().includes(searchTerm)
      );
    }

    return rows;
  }, [formList, q]);

  const openEdit = (item) => {
    // 跳转到编辑页面，使用查询参数传递id
    // 从item中获取templateId，如果没有则使用默认值
    const templateId = item.templateId || "pmr"; // 使用默认模板ID
    nav(`/mobile/template/${templateId}?id=${item.id}`);
  };

  const openView = (item) => {
  const templateId = item.templateId || "pmr";
  // view=1 作为只读标记，模板页可据此判断
  nav(`/mobile/template/${templateId}?id=${item.id}&view=1`);
};

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* 搜索框 */}
        <Input.Search
          allowClear
          size="large"
          className={styles.search}
          placeholder="Search by ID, booth or location"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          loading={loading}
        />

        {/* 二级筛选 chips */}
        <div className={styles.filterBar}>
          <Space size={16} wrap>
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${
                  filter === f ? styles.active : ""
                }`}
                onClick={() => setFilter(f)}
                disabled={loading}
              >
                {f}
              </button>
            ))}
          </Space>
        </div>

        {/* 列表区域 */}
        <div className={styles.list}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
            </div>
          ) : filtered.length === 0 ? (
            <Empty description="No records" />
          ) : (
            filtered.map((item) => (
              <InProgressCard key={item.id} item={item} onEdit={() => openEdit(item)} onView={() => openView(item)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}