import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Input, Typography } from "antd";
import styles from "./ApprovedReportDetail.module.less";

const { Text } = Typography;

const MOCK = {
  "APR-240915-001": {
    id: "APR-240915-001",
    boothName: "ThermoFLO TF-600",
    location: "*******",
    approvedAt: "2025-09-17 14:00",
    inspector: "Admin",
    inspectorMobile: "021 *******",
    userName: "Serati Ma",
  },
};

export default function ApprovedReportDetail() {
  const { reportId } = useParams();

  const raw = MOCK[reportId] || {
    boothName: "—",
    location: "—",
    approvedAt: "—",
    inspector: "—",
    inspectorMobile: "—",
  };

  const data = useMemo(() => {
    return {
      title: `${raw.boothName} Maintenance Service Report`,
      inspector: raw.inspector,
      inspectorMobile: raw.inspectorMobile,
      date:
        raw.approvedAt && raw.approvedAt.includes(" ")
          ? raw.approvedAt.split(" ")[0].replaceAll("-", "/")
          : raw.approvedAt?.replaceAll("-", "/") || "—",
      location: raw.location || "—",
    };
  }, [raw]);

  return (
    <div className={styles.detailPage}>
      <div className={styles.container}>
        {/* 居中的小灰标题 */}
        <div className={styles.titleWrap}>
          <Text>{data.title}</Text>
        </div>

        {/* 只读表单 */}
        <div className={styles.formCard}>
          <div className={styles.formItem}>
            <div className={styles.label}>Inspector*</div>
            <Input size="large" className={styles.input} value={data.inspector} disabled />
          </div>

          <div className={styles.formItem}>
            <div className={styles.label}>Inspector Mobile</div>
            <Input size="large" className={styles.input} value={data.inspectorMobile} disabled />
          </div>

          <div className={styles.formItem}>
            <div className={styles.label}>Date *</div>
            <Input size="large" className={styles.input} value={data.date} disabled />
          </div>

          <div className={styles.formItem}>
            <div className={styles.label}>Location Details</div>
            <Input.TextArea
              className={styles.textarea}
              value={data.location}
              disabled
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}