import React, { useEffect, useState } from "react";
import { Table, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { formsRepo } from "@/domain/forms/repository/forms.repository";

const fmt = (ts) => (ts ? new Date(ts).toLocaleString() : "-");

const AdminToReviewPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await formsRepo.list({ status: "toReview" });
      setRows(data || []);
    } catch (e) {
      message.error(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const columns = [
    { title: "Form Name", dataIndex: "title", render: (t, r) => <Typography.Link onClick={() => navigate(`/admin/review/${r.formId}`)}>{t || r.formId}</Typography.Link> },
    { title: "Creator", dataIndex: "creatorEmail" },
    { title: "Create Time", dataIndex: "createdAt", render: fmt },
    { title: "Submit Time", dataIndex: "submitAt", render: fmt },
    {
      title: "Action",
      render: (_, r) => (
        <Button type="link" onClick={() => navigate(`/admin/review/${r.formId}`)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <>
      <h2>To review</h2>
      <Table
        rowKey="formId"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={false}
      />
    </>
  );
};

export default AdminToReviewPage;
