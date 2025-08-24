import React, { useState, useEffect } from "react";
import { getArrayLevel } from "@/utils/helper";
import { Form, Input, Select, Button, message } from "antd";
import { userStore } from "@/domain/user/store/user.store";
import { useNavigate } from "react-router-dom";
import styles from "../index.module.less";
import { homeStore } from "@/domain/home/store/home.store";

const { Option } = Select;

const RegisterForm = () => {
  const sports = homeStore((state) => state.sports);
  const getSportsList = homeStore((state) => state.getSportsList);
  const registerUser = userStore((state) => state.userRegister);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getSportsList();
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    registerUser(values)
      .then((res) => {
        message.success({
          content: res.message,
          duration: 1.5,
          onClose: () => {
            navigate("/login", { replace: true });
          }
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form layout="vertical" onFinish={onFinish} className={styles.custom_form}>
      <div className={styles.form_header}>Sign up</div>
      <Form.Item label="Name" name="username" rules={[{ required: true }]}>
        <Input className={styles.input_height} />
      </Form.Item>

      <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
        <Select className={styles.input_height}>
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Sport" name="sports" rules={[{ required: true }]}>
        <Select
          className={styles.input_height}
          placeholder="Select a sport"
          loading={!sports || sports.length === 0}
        >
          {sports &&
            sports.map((sport) => (
              <Option key={sport._id} value={sport._id}>
                {sport.name}
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item label="Level" name="level" rules={[{ required: true }]}>
        <Select className={styles.input_height} options={getArrayLevel(5)} />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
        <Input className={styles.input_height} />
      </Form.Item>

      <Form.Item label="Password" name="password" rules={[{ required: true }]}>
        <Input.Password className={styles.input_height} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" className={styles.signup_btn} htmlType="submit" loading={loading}>
          Sign up
        </Button>
      </Form.Item>

      <p>
        Already have an account? <a onClick={() => navigate("/login")}>Sign in</a>
      </p>
    </Form>
  );
};

export default RegisterForm;
