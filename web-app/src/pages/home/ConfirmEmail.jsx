import {Button, Card, Form, Input, Typography} from "antd";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {isAuthenticated} from "../../services/authenticationService";
import {sendOtp} from "../../services/otpService";

export default function ConfirmEmail() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = async (values) => {
        await sendOtp(values.email);
        navigate("/verify-reset-password", {state: {email: values.email}});
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
                    padding: "16px",
                    textAlign: "center",
                }}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    {/* Email */}
                    <Form.Item
                        label="Nhập email đã đăng ký tài khoản"
                        name="email"
                        rules={[
                            {required: true, message: "Vui lòng nhập email!"},
                            {type: "email", message: "Email không hợp lệ!"},
                        ]}
                    >
                        <Input placeholder="abc@gmail.com" size="large"/>
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item style={{marginBottom: 0}}>
                        <Button type="primary" htmlType="submit" size="large" block>
                            Gửi mã xác thực
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
