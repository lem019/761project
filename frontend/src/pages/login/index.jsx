import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/domain/user/store/user.store";
import { http } from "@/utils/request";
import styles from "./index.module.less";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/form-list');
    }
  }, [user, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await http.post('/api/auth/login', values);
      
      if (response.code === 200) {
        // Store the JWT token
        localStorage.setItem('token', response.data.token);
        
        // Set user info in store
        useUserStore.getState().setUser(response.data.user);
        
        message.success('Login successful!');
        navigate('/form-list');
      } else {
        message.error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const goToSSO = () => {
    navigate('/sso-login');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h1 className={styles.title}>Sign In</h1>
        
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input size="large" placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              loading={loading}
              className={styles.loginButton}
              block
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider>Or</Divider>

        <Button 
          size="large" 
          onClick={goToSSO}
          className={styles.ssoButton}
          block
        >
          Continue with Google
        </Button>

        <div className={styles.footer}>
          <p>
            Don't have an account?{' '}
            <a onClick={() => navigate('/register')}>Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 