import React, { useEffect, useState } from "react";
import { http } from "@/utils/request"; 
import styles from "./index.module.less";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


const approvedList = [
  {
    reportId: "123",
    title: "IND80 Booth Maintenance Service Report",
    completed: "2025-09-17 14:00",
  },
  {
    reportId: "124",
    title: "IND80 Booth Maintenance Service Report",
    completed: "2025-09-17 14:00",
  },
  {
    reportId: "125",
    title: "IND80 Booth Maintenance Service Report",
    completed: "2025-09-17 14:00",
  },
  
];

const ApprovedPage = () => {
  const navigate = useNavigate();
  // const [approvedList, setApprovedList] = useState([]);

  // useEffect(() => {
  //   // 假设后端接口为 /api/approved
  //   http.get("/api/approved").then(res => {
  //     setApprovedList(res.data); // 根据实际返回结构调整
  //   });
  // }, []);
  return (
      <div className={styles.cardList}>
        {approvedList.map((item, idx) => (
          <div
            className={styles.card}
            key={item.reportId}
            onClick={() => navigate(`/mobile/report/${item.reportId}`)}
          >
            <div className={styles.title}>{item.title}</div>
            <div className={styles.time}>
              <span className={styles.icon}><ClockCircleOutlined /></span>
              Completed: {item.completed}
            </div>
          </div>
        ))}
      </div>
    );
  };

export default ApprovedPage;