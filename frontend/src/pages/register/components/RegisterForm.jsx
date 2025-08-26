import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { userStore } from "@/domain/user/store/user.store";
import { useNavigate } from "react-router-dom";
import styles from "../index.module.less";


const RegisterForm = () => {
  // This line uses the userStore hook to access the userRegister function from the global user store.
  // The userRegister function is responsible for handling the registration logic (e.g., sending user data to the backend).
  // We assign it to the registerUser variable so we can call it when the form is submitted.
  const registerUser = userStore((state) => state.userRegister);
  const navigate = useNavigate();

  useEffect(() => {
    // This useEffect hook is used to fetch the email list when the component mounts.
  }, []);

  const onFinish = (values) => {
    const { confirmPassword, ...userData } = values;
    
    //The user data (email and password) passed to the registerUser function, which is responsible for sending the registration request to the backend.
    registerUser(userData)
      .then((res) => {
        // Registration successful, redirect to login page
        navigate("/login", { replace: true });
      });
  };

  return (
    <Form layout="vertical" onFinish={onFinish} className={styles.custom_form}>
      <div className={styles.form_header}>Register</div>
      
      <Form.Item 
        name="email" 
        rules={[
          { required: true, message: 'Please input your email!' },
          {
            pattern: /^[a-zA-Z0-9._%+-]+@thermoflo\.co\.nz$/,
            message: 'Email must be from @thermoflo.co.nz domain!'
          }
        ]}
      >
        <Input 
          className={styles.input_height} 
          placeholder="Email"
        />
      </Form.Item>

      <Form.Item 
        name="password" 
        rules={[
          { required: true, message: 'Please input your password!' },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            message: 'Password must be at least 8 characters containing uppercase letters, lowercase letters, and numbers!'
          }
        ]}
      >
        <Input.Password 
          className={styles.input_height} 
          placeholder="Password (min 8 chars, uppercase, lowercase, numbers)"
        />
      </Form.Item>

      <Form.Item 
        name="confirmPassword" 
        rules={[
          { required: true },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password 
          className={styles.input_height} 
          placeholder="Comfirm password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" className={styles.signup_btn} htmlType="submit">
          Register
        </Button>
      </Form.Item>

      <p>
        Already have an account? <a onClick={() => navigate("/login")}>Sign in</a>
      </p>
    </Form>
  );
};

export default RegisterForm;
