import {EyeOutlined, LockOutlined, NotificationOutlined, UserOutlined,} from "@ant-design/icons";
import {Card, Col, List, Row} from "antd";
import {useState} from "react";
import PasswordSetting from "../../components/PasswordSetting";

export default function Settings() {
    const [selectedSetting, setSelectedSetting] = useState("account");

    const settingsOptions = [
        {key: "account", icon: <UserOutlined/>, text: "Cài đặt tài khoản"},
        {key: "security", icon: <LockOutlined/>, text: "Mật khẩu và bảo mật"},
        {
            key: "notifications",
            icon: <NotificationOutlined/>,
            text: "Cài đặt thông báo",
        },
        {key: "privacy", icon: <EyeOutlined/>, text: "Cài đặt quyền riêng tư"},
    ];

    const renderSettingContent = () => {
        switch (selectedSetting) {
            case "account":
                return <p>Cài đặt tài khoản.</p>;
            case "security":
                return <PasswordSetting/>;
            case "notifications":
                return <p>Cài đặt thông báo.</p>;
            case "privacy":
                return <p>Cài đặt quyền riêng tư.</p>;
            default:
                return <p>Chọn một mục để xem chi tiết.</p>;
        }
    };

    return (
        <>
            <Row gutter={[16]}>
                {/* Cột bên trái: Danh sách cài đặt */}
                <Col xl={10}>
                    <Card title="Cài đặt">
                        <List
                            itemLayout="horizontal"
                            dataSource={settingsOptions}
                            renderItem={(item) => (
                                <List.Item
                                    onClick={() => setSelectedSetting(item.key)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor:
                                            selectedSetting === item.key ? "#e6f7ff" : "white",
                                        transition: "background-color 0.3s",
                                        borderRadius: "8px",
                                    }}
                                    className="hover-effect"
                                >
                                    <List.Item.Meta
                                        avatar={item.icon}
                                        title={<span>{item.text}</span>}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* Cột bên phải: Nội dung chi tiết */}
                <Col xl={14}>
                    <Card title="Chi tiết cài đặt" className="bg">
                        {renderSettingContent()}
                    </Card>
                </Col>
            </Row>

            {/* CSS cho hiệu ứng hover */}
            <style>
                {`
          .hover-effect:hover {
            background-color: #f5f5f5 !important;
          }
        `}
            </style>
        </>
    );
}
