import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Input, Button, Space, message, Descriptions } from "antd";
import { formsRepo } from "@/domain/forms/repository/forms.repository";

const FormEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await formsRepo.get(id);
      setForm(res);
      setData(res?.data || "");
    } catch (e) {
      message.error(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const onSave = async () => {
    try {
      await formsRepo.updateDraft(id, { data });
      message.success("Saved");
    } catch (e) {
      message.error(e.message || "Save failed");
    }
  };

  const onSubmit = async () => {
    try {
      await formsRepo.updateDraft(id, { data });
      await formsRepo.submit(id);
      message.success("Submitted");
      navigate("/employee/pending", { replace: true });
    } catch (e) {
      message.error(e.message || "Submit failed");
    }
  };

  if (!form) return null;
  const isDraft = form.status === "draft";

  return (
    <>
      <h2>Form details</h2>
      <Card>
        <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
          <Descriptions.Item label="Form ID">{form.formId}</Descriptions.Item>
          <Descriptions.Item label="Status">{form.status}</Descriptions.Item>
          <Descriptions.Item label="Title" span={2}>{form.title}</Descriptions.Item>
        </Descriptions>

        <div style={{ marginBottom: 12 }}>Question: Please fill some text</div>
        <Input.TextArea
          rows={6}
          value={data}
          onChange={(e) => setData(e.target.value)}
          readOnly={!isDraft}
          placeholder="Type something..."
        />

        {isDraft && (
          <Space style={{ marginTop: 16 }}>
            <Button onClick={onSave}>Save</Button>
            <Button type="primary" onClick={onSubmit}>Submit</Button>
            <Button onClick={() => navigate(-1)}>Back</Button>
          </Space>
        )}
      </Card>
    </>
  );
};

export default FormEditPage;
