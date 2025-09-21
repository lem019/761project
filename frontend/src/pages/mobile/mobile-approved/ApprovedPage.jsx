import React, { useEffect, useState } from "react";
import { http } from "@/utils/request";
import { getFormList } from "@/services/form-service";
import styles from "./index.module.less";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Spin, message } from "antd";

const ApprovedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDetail = location.pathname.includes("/report/");
  const [approvedList, setApprovedList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取已批准的表单列表
  const fetchApprovedList = async () => {
    try {
      setLoading(true);
      const response = await getFormList({
        status: 'approved',
        page: 1,
        pageSize: 20
      });

      if (response) {
        const approvedForms = response.items || [];
        setApprovedList(approvedForms.map(item => ({
          reportId: item.id,
          title: item.templateName || 'Unknown Form',
          completed: item.reviewedAt || item.createdAt || ''
        })));
      }
    } catch (error) {
      console.error('获取已批准表单列表失败:', error);
      message.error('获取已批准表单列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isDetail) {
      fetchApprovedList();
    }
  }, [isDetail]);
  return (
    <>
      {!isDetail && (
        <div className={styles.cardList}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
            </div>
          ) : approvedList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
              暂无已批准的表单
            </div>
          ) : (
            approvedList.map((item, idx) => (
              <div
                className={styles.card}
                key={item.reportId}
                onClick={() => navigate(`/mobile/approved/report/${item.reportId}`)}
              >
                <div className={styles.title}>{item.title}</div>
                <div className={styles.time}>
                  <span className={styles.icon}><ClockCircleOutlined /></span>
                  Completed: {item.completed}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <Outlet />
    </>
  );
};

export default ApprovedPage;