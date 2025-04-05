import {Button, Form, Input, message} from "antd";
import {useEffect, useState} from "react";
import {getMyInfo} from "../services/userService";
import {changePassword, setPassword} from "../services/passwordService";

export default function Password() {
    const [myInfo, setMyInfo] = useState(null);
    console.log(myInfo);

    useEffect(() => {
        const fetchMyInfo = async () => {
            try {
                const response = await getMyInfo();
                setMyInfo(response.data?.result);
            } catch (error) {
                message.error(error.response?.data?.message || "Lỗi khi tải thông tin tài khoản!");
            }
        };
        fetchMyInfo();
    }, [setMyInfo]);

    const [formSet] = Form.useForm();
    const [formChange] = Form.useForm();

    const handleCancel = () => {
        // Reset form về giá trị ban đầu (initialValues)
        formSet.resetFields();
        formChange.resetFields();
    };

    const handleChangePassword = async (values) => {
        if (values.newPassword !== values.reNewPassword) {
            message.error("Nhập lại mật khẩu không khớp!");
            return;
        }

        if (values.newPassword === values.oldPassword) {
            message.error("Mật khẩu mới phải khác mật khẩu cũ!");
            return;
        }

        const body = {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
        };

        try {
            await changePassword(body);
            message.success("Đổi mật khẩu thành công!");
        } catch (error) {
            message.error(error.response?.data?.message || "Lỗi khi đổi mật khẩu!");
        }

        formChange.resetFields();
    };

    const handleSetPassword = async (values) => {
        if (values.password !== values.rePassword) {
            message.error("Nhập lại mật khẩu không khớp!");
            return;
        }

        const body = {
            password: values.password,
        };

        try {
            await setPassword(body);
            message.success("Đặt mật khẩu thành công!");
        } catch (error) {
            message.error(error.response?.data?.message || "Lỗi khi đặt mật khẩu!");
        }
    };

    return (
        <>
            {myInfo && (myInfo.hasPassword ? (
                <>
                    <h2 style={{marginBottom: 20}}>Đổi mật khẩu</h2>

                    <Form
                        form={formChange}
                        onFinish={handleChangePassword}
                        style={{maxWidth: 350}}
                        layout="vertical"
                    >
                        <Form.Item
                            label="Mật khẩu cũ"
                            name="oldPassword"
                            rules={[{required: true, message: "Vui lòng nhập mật khẩu cũ!"}]}
                        >
                            <Input.Password placeholder="Mật khẩu cũ" size="large"/>
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[{required: true, message: "Vui lòng nhập mật khẩu mới!"}]}
                        >
                            <Input.Password placeholder="Mật khẩu mới" size="large"/>
                        </Form.Item>

                        <Form.Item
                            label="Nhập lại mật khẩu mới"
                            name="reNewPassword"
                            dependencies={["newPassword"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập lại mật khẩu mới!",
                                },
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("New password do not match!")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu mới" size="large"/>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                onClick={handleCancel}
                                style={{marginRight: 16}}
                                size="large"
                            >
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" size="large">
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            ) : (
                <>
                    <h2 style={{marginBottom: 20}}>Đặt mật khẩu</h2>

                    <Form
                        form={formSet}
                        onFinish={handleSetPassword}
                        style={{maxWidth: 400}}
                        layout="vertical"
                    >
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{required: true, message: "Vui lòng nhập mật khẩu!"}]}
                        >
                            <Input.Password placeholder="Mật khẩu" size="large"/>
                        </Form.Item>

                        <Form.Item
                            label="Mật lại khẩu"
                            name="rePassword"
                            rules={[{required: true, message: "Vui lòng nhập lại mật khẩu!"}]}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu" size="large"/>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                onClick={handleCancel}
                                size="large"
                                style={{marginRight: 16}}
                            >
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" size="large">
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            ))}
        </>)
}