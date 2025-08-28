import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/domain/user/store/user.store";
import { http } from "@/utils/request";
import styles from "./index.module.less";
import logo from "@/assets/img/logo.png";
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { signInWithGoogle } from "@/firebase";
import googleIcon from "@/assets/img/google.svg";

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
        if (values.remember) {
          localStorage.setItem('token', response.data.token); // Long-term storage
        } else {
          sessionStorage.setItem('token', response.data.token); // Session-only storage
        }
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

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <img className={styles.logo} src={logo} alt="logo" />
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <div className={styles.loginBox}>Login</div>
          <Divider style={{ marginTop: 4 }}></Divider>

          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input size="large" placeholder="Enter your email" prefix={<MailOutlined style={{ color: '#1677ff' }} />} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password size="large" placeholder="Enter your password" prefix={<LockOutlined style={{ color: '#1677ff' }} />}/>
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
            <label className={styles.rememberMe}>
              <input type="checkbox" />
              <span style={{ marginLeft: '6px' }}>Remember me</span>
            </label>
          </Form.Item>
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

        <Button
          size="large"
          icon={<img className={styles.googleIcon} src={googleIcon} alt="Google" />}
          block
          className={styles.ssoButton}
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>

        <div className={styles.footer}>
          <p>
            No account?{' '}
            <a onClick={() => navigate('/register')}>Create One</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;