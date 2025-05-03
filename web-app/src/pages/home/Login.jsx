import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, message, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OAuthConfig } from "../../configurations/configuration";
import { useUserDetails } from "../../contexts/UserContext";
import { logIn } from "../../services/authenticationService";

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { userDetails, updateUser } = useUserDetails();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userDetails) {
      navigate("/");
    }
  }, [navigate, userDetails]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await logIn(values.email, values.password);
      updateUser();
      console.log("Response body:", response.data);
      navigate("/");
    } catch (error) {
      message.error(
        "Email hoặc mật khẩu không chính xác!" || error.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithFacebook = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const facebookAuthUrl = OAuthConfig.authUri_facebook;
    const facebookClientId = OAuthConfig.clientId_facebook;

    // Lưu provider vào localStorage
    localStorage.setItem("oauth_provider", "facebook");

    window.location.href = `${facebookAuthUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${facebookClientId}&scope=email%20public_profile`;
  };

  const handleContinueWithGoogle = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const googleAuthUrl = OAuthConfig.authUri_google;
    const googleClientId = OAuthConfig.clientId_google;

    // Lưu provider vào localStorage
    localStorage.setItem("oauth_provider", "google");

    window.location.href = `${googleAuthUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Typography.Title
        level={1}
        style={{ color: "var(--primary-color)", fontWeight: "bold" }}
      >
        BookNest
      </Typography.Title>

      <Card
        style={{
          minWidth: 300,
          maxWidth: 400,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "16px",
          textAlign: "center",
        }}
      >
        <Typography.Title level={3}>Đăng nhập</Typography.Title>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="abc@gmail.com" size="large" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" size="large" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Link to="/password/reset">Quên mật khẩu?</Link>

        <Divider />

        {/* Đăng nhập bằng MXH */}
        <Button
          type="primary"
          icon={<FacebookOutlined />}
          size="large"
          onClick={handleContinueWithFacebook}
          style={{
            backgroundColor: "var(--primary-color)",
            border: "none",
            width: "100%",
            marginBottom: "10px",
          }}
        >
          Đăng nhập bằng Facebook
        </Button>

        <Button
          type="primary"
          icon={<GoogleOutlined />}
          size="large"
          onClick={handleContinueWithGoogle}
          style={{
            backgroundColor: "#E34133",
            border: "none",
            width: "100%",
            marginBottom: "10px",
          }}
        >
          Đăng nhập bằng Google
        </Button>

        <Typography.Text>
          Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </Typography.Text>
      </Card>
    </div>
  );
}
