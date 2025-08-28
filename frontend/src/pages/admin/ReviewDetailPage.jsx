import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Input, message, Space, Descriptions } from "antd";
import { formsRepo } from "@/domain/forms/repository/forms.repository";

const ReviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await formsRepo.get(id);
      setForm(data);
    } catch (e) {
      message.error(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const onReview = async (action) => {
    try {
      await formsRepo.review(id, action);
      message.success(action === "approve" ? "Approved" : "Rejected");
      navigate(action === "approve" ? "/admin/approved" : "/admin/rejected", { replace: true });
    } catch (e) {
      message.error(e.message || "Review failed");
    }
  };

  if (!form) return null;

  return (
    <>
      <h2>Form Review</h2>
      <Card>
        <Descriptions bordered size="small" column={1} style={{ marginBottom: 16 }}>
          <Descriptions.Item label="Form ID">{form.formId}</Descriptions.Item>
          <Descriptions.Item label="Title">{form.title}</Descriptions.Item>
          <Descriptions.Item label="Creator">{form.creatorEmail || form.creatorUid}</Descriptions.Item>
          <Descriptions.Item label="Status">{form.status}</Descriptions.Item>
        </Descriptions>

        <div style={{ marginBottom: 12 }}>Form data</div>
        <Input.TextArea
          rows={6}
          value={form?.data || ""}
          readOnly
        />

        <Space style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => onReview("approve")}>Approve</Button>
          <Button danger onClick={() => onReview("reject")}>Reject</Button>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </Space>
      </Card>
    </>
  );
};

export default ReviewDetailPage;
