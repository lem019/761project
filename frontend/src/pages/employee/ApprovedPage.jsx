import React, { useEffect, useState } from "react";
import { Table, Typography, message } from "antd";
import { formsRepo } from "@/domain/forms/repository/forms.repository";

const fmt = (ts) => (ts ? new Date(ts).toLocaleString() : "-");

const EmployeeApprovedPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await formsRepo.list({ status: "approved", mine: true });
      setRows(data || []);
    } catch (e) {
      message.error(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const columns = [
    { title: "Form Name", dataIndex: "title", render: (t, r) => <Typography.Text>{t || r.formId}</Typography.Text> },
    { title: "Create Time", dataIndex: "createdAt", render: fmt },
    { title: "Submit Time", dataIndex: "submitAt", render: fmt },
  ];

  return (
    <>
      <h2>Approved</h2>
      <Table rowKey="formId" loading={loading} columns={columns} dataSource={rows} pagination={false} />
    </>
  );
};

export default EmployeeApprovedPage;
