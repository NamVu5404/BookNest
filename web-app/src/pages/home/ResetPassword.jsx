import { Button, Card, Form, Input, message, Typography } from "antd";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/passwordService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Lấy email và verificationCode từ state
  const email = location.state?.email;

  if (!email) {
    // Nếu không có thông tin cần thiết, chuyển hướng về trang quên mật khẩu
    navigate("/password/reset");
    return null;
  }

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

  // Validate confirm password
  const validateConfirmPassword = (_, value) => {
    if (!value) {
      return Promise.reject("Vui lòng xác nhận mật khẩu!");
    }
    if (value !== form.getFieldValue("password")) {
      return Promise.reject("Xác nhận mật khẩu không khớp!");
    }
    return Promise.resolve();
  };

  // Hàm đặt lại mật khẩu
  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      // Gọi API đặt lại mật khẩu
      try {
        await resetPassword(email, values.password);
        message.success("Đặt lại mật khẩu thành công!");
      } catch (error) {
        message.error(
          error.response?.data?.message ||
          "Đã xảy ra lỗi khi đặt lại mật khẩu! Vui lòng thử lại."
        );
        navigate("/password/reset");
      }

      navigate("/login");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Đặt lại mật khẩu thất bại!"
      );
    } finally {
      setLoading(false);
    }
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
        <Typography.Title level={3}>Đặt lại mật khẩu</Typography.Title>

        <Typography.Paragraph>
          Nhập mật khẩu mới cho tài khoản <strong>{email}</strong>
        </Typography.Paragraph>

        <Form form={form} layout="vertical" onFinish={handleResetPassword}>
          {/* Password */}
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[{ required: true, validator: validatePassword }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" size="large" />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            rules={[{ required: true, validator: validateConfirmPassword }]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
