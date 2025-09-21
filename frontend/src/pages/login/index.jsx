import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Divider } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import useUserStore from "@/domain/user/store/user.store";
import styles from "./index.module.less";
import logo from "@/assets/img/logo.png";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { signInWithGoogle } from "@/firebase";
import googleIcon from "@/assets/img/google.svg";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { user, userLogin } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 获取登录前要跳转的路径
  const from = location.state?.from?.pathname || '/pc/create';

  // 已登录则跳转到目标页面
  useEffect(() => {
    if (user?.role === "admin" || user?.role === "primary") {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const me = await userLogin(values);
      console.log(me);
      if (me?.role === "admin" || me?.role === "primary") {
        navigate(from, { replace: true });
      } else {
        message.warning("Login succeeded but role is missing. Please set role in Firestore.");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle(); // onAuthStateChanged 会注入 user；上面的 useEffect 会跳转
    } catch (error) {
      console.error("Google login failed:", error);
      message.error("Google login failed");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <img className={styles.logo} src={logo} alt="logo" />
        <Form name="login" onFinish={onFinish} autoComplete="off" layout="vertical">
          <div className={styles.loginBox}>Login</div>
          <Divider style={{ marginTop: 4 }}></Divider>

          <Form.Item name="email" rules={[{ required: true, message: "Please enter your email!" }]}>
            <Input
              size="large"
              placeholder="Enter your email"
              prefix={<MailOutlined style={{ color: "#1677ff" }} />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              size="large"
              placeholder="Enter your password"
              prefix={<LockOutlined style={{ color: "#1677ff" }} />}
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <label className={styles.rememberMe}>
                <input type="checkbox" />
                <span style={{ marginLeft: "6px" }}>Remember me</span>
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
            No account? <a onClick={() => navigate("/register")}>Create One</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
