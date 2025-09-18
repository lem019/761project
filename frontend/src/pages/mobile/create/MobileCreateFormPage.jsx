import React from "react";
import { Form, Input, DatePicker, Button, message } from "antd";
import styles from "./MobileCreateFormPage.module.less";

const { TextArea } = Input;

export default function MobileCreateFormPage() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    // TODO: 在这里对接你的后端/Firestore
    // 比如 await http.post('/api/mobile/create', values)
    message.success("Saved");
    // form.resetFields();
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* 标题（居中小灰字） */}
        <div className={styles.titleWrap}>Inspection Information Registration</div>

        {/* 表单卡片 */}
        <div className={styles.card}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark="optional"
          >
            <Form.Item
              label="Inspector *"
              name="inspector"
              rules={[{ required: true, message: "Please enter inspector name" }]}
            >
              <Input
                size="large"
                placeholder="Please enter inspector name"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item
              label="Inspector Mobile"
              name="inspectorMobile"
              rules={[
                { pattern: /^[0-9+\-\s]*$/, message: "Invalid mobile number" },
              ]}
            >
              <Input
                size="large"
                placeholder="Please enter inspector mobile number"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item
              label="Date *"
              name="date"
              rules={[{ required: true, message: "Please pick a date" }]}
            >
              <DatePicker
                placeholder="dd/mm/yyyy"
                className={styles.date}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>

            <Form.Item label="Locations Details" name="locationDetails">
              <TextArea
                placeholder="Please enter location details"
                autoSize={{ minRows: 3, maxRows: 6 }}
                className={styles.textarea}
              />
            </Form.Item>

            <Form.Item label="Contact Person" name="contactPerson">
              <Input
                size="large"
                placeholder="Please enter contact person name"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item label="Business Name" name="businessName">
              <Input
                size="large"
                placeholder="Please enter business name"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item label="Address" name="address">
              <Input
                size="large"
                placeholder="Please enter business address"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item label="Suburb" name="suburb">
              <Input
                size="large"
                placeholder="Please enter suburb/area"
                className={styles.input}
              />
            </Form.Item>

            <div className={styles.actions}>
              <Button htmlType="button" onClick={() => form.resetFields()}>
                Reset
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}