import {Button, Card, Form, Input, message, Typography} from "antd";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {sendOtp, verificationOtpCode} from "../services/otpService";
import {register} from "../services/userService";

// context có thể là "registration" hoặc "resetPassword"
const EmailVerificationForm = ({
                                   email,
                                   context = "registration",
                                   userCreateData,
                               }) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isVerifyingLoading, setIsVerifyingLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Kiểm tra email hợp lệ
    useEffect(() => {
        if (!email) {
            message.error("Không tìm thấy thông tin email.");
            navigate("/");
        }
    }, [email, navigate, context]);

    // Xử lý đếm ngược cho nút gửi lại mã
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Hàm xác thực email
    const handleVerify = async (values) => {
        try {
            setIsVerifyingLoading(true);

            // Gọi API xác thực email
            const response = await verificationOtpCode(email, values.otpCode);

            if (response.data?.result.valid) {
                if (context === "registration") {
                    // Cho trường hợp đăng ký: gọi API tạo user sau khi xác thực thành công
                    try {
                        await register(userCreateData);
                        message.success("Đăng ký thành công!");
                    } catch (error) {
                        message.error(
                            error.response?.data?.message ||
                            "Đã xảy ra lỗi khi đăng ký! Vui lòng thử lại."
                        );
                        navigate("/register");
                    }

                    navigate("/login");
                } else if (context === "resetPassword") {
                    // Cho trường hợp đặt lại mật khẩu: chuyển hướng đến trang đặt mật khẩu mới
                    navigate("/reset-password", {state: {email}});
                }
            } else {
                message.error("Mã xác thực không hợp lệ!");
            }
        } catch (error) {
            message.error(
                error.response?.data?.message || "Mã xác thực không hợp lệ!"
            );
        } finally {
            setIsVerifyingLoading(false);
        }
    };

    // Hàm gửi lại mã xác thực
    const handleResendCode = async () => {
        try {
            setResendLoading(true);

            // Gọi API gửi lại mã xác thực
            await sendOtp(email);

            message.success("Đã gửi lại mã xác thực!");
            setCountdown(60); // Đặt thời gian chờ 60 giây trước khi có thể gửi lại
        } catch (error) {
            message.error(
                error.response?.data?.message || "Không thể gửi lại mã xác thực!"
            );
        } finally {
            setResendLoading(false);
        }
    };

    const pageTitle =
        context === "registration" ? "Xác thực Email" : "Xác nhận Đặt lại Mật khẩu";

    const instructionText =
        context === "registration"
            ? "Vui lòng kiểm tra hộp thư đến và nhập mã xác thực để hoàn tất đăng ký"
            : "Vui lòng kiểm tra hộp thư đến và nhập mã xác thực để đặt lại mật khẩu";

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
                style={{color: "var(--primary-color)", fontWeight: "bold"}}
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
                <Typography.Title level={3}>{pageTitle}</Typography.Title>

                <Typography.Paragraph>
                    Chúng tôi đã gửi mã xác thực đến email <strong>{email}</strong>
                </Typography.Paragraph>

                <Typography.Paragraph type="secondary">
                    {instructionText}
                </Typography.Paragraph>

                <Form form={form} layout="vertical" onFinish={handleVerify}>
                    <Form.Item
                        name="otpCode"
                        rules={[
                            {required: true, message: "Vui lòng nhập mã xác thực!"},
                            {len: 6, message: "Mã xác thực phải có 6 ký tự!"},
                        ]}
                    >
                        <Input
                            placeholder="Nhập mã xác thực"
                            size="large"
                            maxLength={6}
                            style={{textAlign: "center", letterSpacing: "0.5em"}}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={isVerifyingLoading}
                        >
                            Xác thực
                        </Button>
                    </Form.Item>
                </Form>

                <Typography.Paragraph style={{marginTop: 16}}>
                    Không nhận được mã?{" "}
                    <Button
                        type="link"
                        onClick={handleResendCode}
                        disabled={countdown > 0}
                        loading={resendLoading}
                        style={{padding: 0}}
                    >
                        {countdown > 0
                            ? `Gửi lại sau (${countdown}s)`
                            : "Gửi lại mã xác thực"}
                    </Button>
                </Typography.Paragraph>
            </Card>
        </div>
    );
};

export default EmailVerificationForm;
