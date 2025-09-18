import React, { useMemo, useState } from "react";
import { Input, Empty, Space } from "antd";
import { useNavigate } from "react-router-dom";
import InProgressCard from "./InProgressCard";
import styles from "./InProgressPage.module.less";

const mockRows = [
  {
    id: "IP-240915-001",
    title: "IND80 Booth Maintenance Service Report",
    date: "2024-12-09 09:15",
    status: "Pending", // Draft | Pending | Declined
  },
  {
    id: "IP-240915-002",
    title: "IND81 PMR Maintenance Service Report",
    date: "2024-12-09 09:15",
    status: "Draft",
  },
  {
    id: "IP-240915-003",
    title: "IND80 Dynapumps Booth Maintenance Service Report",
    date: "2024-12-09 09:15",
    status: "Declined",
  },
];

const FILTERS = ["ALL", "Draft", "Pending", "Declined"];

export default function InProgressPage() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = useMemo(() => {
    let rows = mockRows;
    if (filter !== "ALL") rows = rows.filter((r) => r.status === filter);
    if (q.trim()) {
      const kw = q.toLowerCase();
      rows = rows.filter((r) =>
        [r.id, r.title].join(" ").toLowerCase().includes(kw)
      );
    }
    return rows;
  }, [q, filter]);

  const openEdit = (id) => {
    // 与 AppRoutes 对齐：/mobile/inprogress/:id
    // nav(`/mobile/inprogress/${id}`);
    // todo 暂时到 template 页面
    nav(`/mobile/template`);
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
              >
                {f}
              </button>
            ))}
          </Space>
        </div>

        {/* 列表区域 */}
        <div className={styles.list}>
          {filtered.length === 0 ? (
            <Empty description="No records" />
          ) : (
            filtered.map((item) => (
              <InProgressCard key={item.id} item={item} onEdit={openEdit} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}