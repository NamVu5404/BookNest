import { Button, Card, Divider, Form, Input, message, Typography } from "antd";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authenticationService";
import { sendOtp } from "../../services/otpService";

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (values) => {
    try {
      const data = {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      };

      await sendOtp(data.email);

      navigate("/verify-email", {
        state: { email: data.email, userCreateData: data },
      });
    } catch (error) {
      message.error(error.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  // Validate password according to requirements (8-32 characters)
  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject("Vui lòng nhập mật khẩu!");
    }
    if (value.length < 8 || value.length > 32) {
      return Promise.reject("Mật khẩu phải từ 8 đến 32 ký tự!");
    }
    return Promise.resolve();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: "20px 0",
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
          minWidth: 400,
          maxWidth: 500,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: 16,
          textAlign: "center",
        }}
      >
        <Typography.Title level={3}>Đăng ký</Typography.Title>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Full Name */}
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nguyễn Văn A" size="large" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              {
                pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "Email không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="abc@gmail.com" size="large" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, validator: validatePassword }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" size="large" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <Typography.Text>
          Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </Typography.Text>
      </Card>
    </div>
  );
}
