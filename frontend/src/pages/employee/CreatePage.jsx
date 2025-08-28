import React, { useEffect, useState } from "react";
import { Button, Input, Space, Table, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { formsRepo } from "@/domain/forms/repository/forms.repository";

const fmt = (ts) => (ts ? new Date(ts).toLocaleString() : "-");

const EmployeeCreatePage = () => {
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadDrafts = async () => {
    setLoading(true);
    try {
      const data = await formsRepo.list({ status: "draft", mine: true });
      setRows(data || []);
    } catch (e) {
      message.error(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDrafts(); }, []);

  const onCreate = async () => {
    if (!title.trim()) return message.warning("Please enter form name");
    try {
      const res = await formsRepo.create({ title, type: "a" });
      message.success("Created");
      setTitle("");
      await loadDrafts();
      // 直接进入编辑
      if (res?.formId) navigate(`/employee/form/${res.formId}`);
    } catch (e) {
      message.error(e.message || "Create failed");
    }
  };

  const columns = [
    { title: "Form Name", dataIndex: "title", render: (t, r) => <Typography.Text>{t || r.formId}</Typography.Text> },
    { title: "Create Time", dataIndex: "createdAt", render: fmt },
    {
      title: "Action",
      render: (_, r) => (
        <Button type="link" onClick={() => navigate(`/employee/form/${r.formId}`)}>
          Continue
        </Button>
      ),
    },
  ];

  return (
    <>
      <h2>Create Form</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Form name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: 320 }}
        />
        <Button type="primary" onClick={onCreate}>Create Form</Button>
      </Space>

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

export default EmployeeCreatePage;
