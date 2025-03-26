import React from "react";
import {Button, Modal, Space, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {ExclamationCircleOutlined} from "@ant-design/icons";

const {Text, Title} = Typography;

/**
 * LoginRequiredModal - Component hiển thị thông báo yêu cầu đăng nhập
 *
 * @param {boolean} isOpen - Trạng thái hiển thị của modal
 * @param {function} onClose - Hàm xử lý khi đóng modal
 * @param {string} title - Tiêu đề của modal (mặc định: "Yêu cầu đăng nhập")
 * @param {string} message - Nội dung thông báo (mặc định: "Bạn cần đăng nhập để sử dụng tính năng này")
 * @param {string} redirectPath - Đường dẫn chuyển hướng (mặc định: "/login")
 * @param {string} buttonText - Text của nút đăng nhập (mặc định: "Đăng nhập ngay")
 * @returns {JSX.Element} LoginRequiredModal component
 */
export default function LoginRequiredModal({
                                               isOpen = false,
                                               onClose = () => {
                                               },
                                               title = "Yêu cầu đăng nhập",
                                               message = "Bạn cần đăng nhập để sử dụng tính năng này",
                                               redirectPath = "/login",
                                               buttonText = "Đăng nhập ngay",
                                           }) {
    const navigate = useNavigate();

    const handleRedirect = () => {
        onClose();
        navigate(redirectPath);
    };

    return (
        <Modal
            style={{maxWidth: 350}}
            title={
                <Space>
                    <ExclamationCircleOutlined style={{color: "#faad14"}}/>
                    <Title level={5} style={{margin: 0}}>
                        {title}
                    </Title>
                </Space>
            }
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Đóng
                </Button>,
                <Button key="login" type="primary" onClick={handleRedirect}>
                    {buttonText}
                </Button>,
            ]}
            centered
        >
            <Text>{message}</Text>
        </Modal>
    );
}
