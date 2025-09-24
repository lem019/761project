import React from "react";
import { Button } from "antd";
import { ClockCircleOutlined, EditOutlined } from "@ant-design/icons";
import styles from "./InProgressCard.module.less";

/**
 * 图二风格的大卡片
 * props:
 *  - item: { id, title, date, status: "Draft"|"Pending"|"Declined" }
 *  - onEdit: (id) => void
 */
export default function InProgressCard({ item, onEdit, onView }) {
  const handleCardClick = () => {
    if (item.status === "Pending") {
      onView?.(item.id);
    }
  };
  return (
    <div className={styles.card}
      onClick={handleCardClick}
      style={item.status === "Pending" ? { cursor: "pointer" } : {}}
    >
      {/* 标题 + 右上状态胶囊 */}
      <div className={styles.rowTop}>
        <div className={styles.title}>{item.title}</div>
        <span className={`${styles.badge} ${styles[item.status?.toLowerCase()]}`}>
          {item.status}
        </span>
      </div>

      {/* 时间行 */}
      <div className={styles.rowTime}>
        <ClockCircleOutlined className={styles.clock} />
        <span>{item.date}</span>
      </div>

    {/* 底部分隔线 + 操作区 */}
      <div className={styles.divider} />
      <div className={styles.footer}>
        {item.status !== "Pending" && (
          <Button
            size="middle"
            icon={<EditOutlined />}
            onClick={e => {
              e.stopPropagation();
              onEdit?.(item.id);
            }}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}