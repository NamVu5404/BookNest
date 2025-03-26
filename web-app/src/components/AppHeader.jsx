import {
    BellOutlined,
    DownOutlined,
    LogoutOutlined,
    MailOutlined,
    SearchOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {Avatar, Badge, Dropdown, Input, Layout, Menu, Space, Tooltip,} from "antd";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useUserDetails} from "../contexts/UserContext";
import {logOut} from "../services/authenticationService";
import LoginRequiredModal from "./LoginRequiredModal";

const {Header} = Layout;

export default function AppHeader() {
    const [menuVisible, setMenuVisible] = useState(false);
    const navigate = useNavigate();
    const {userDetails, updateUser} = useUserDetails();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showLoginModal = () => {
        setIsModalOpen(true);
    };

    const hideLoginModal = () => {
        setIsModalOpen(false);
    };

    const handleMenuClick = ({key}) => {
        if (key === "profile") {
            navigate("/profile");
        }

        if (key === "settings") {
            navigate("/settings");
        }

        if (key === "logout") {
            logOut();
            updateUser();
            navigate("/login");
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="profile" icon={<UserOutlined/>}>
                Trang cá nhân
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined/>}>
                Cài đặt
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="logout" icon={<LogoutOutlined/>}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 20px",
                    background: "#fff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                    width: "100%",
                    margin: 0,
                    position: "sticky",
                    top: 0,
                    zIndex: 999,
                }}
            >
                <img
                    src="/logo/booknest-text-logo.svg"
                    alt="logo"
                    height={50}
                    onClick={() => navigate("/")}
                    style={{
                        cursor: "pointer",
                    }}
                />
                <Space style={{flexGrow: 1, marginLeft: 20}}>
                    <Input
                        placeholder="Tìm kiếm"
                        prefix={<SearchOutlined/>}
                        style={{width: 200}}
                    />
                </Space>
                <Space size="large">
                    <Badge count={4}>
                        <MailOutlined style={{fontSize: 20}}/>
                    </Badge>
                    <Badge count={17}>
                        <BellOutlined style={{fontSize: 20}}/>
                    </Badge>
                    <Tooltip title="Tài khoản">
                        {userDetails ? (
                            <Dropdown
                                overlay={menu}
                                trigger={["click"]}
                                open={menuVisible}
                                onOpenChange={setMenuVisible}
                            >
                                <div style={{position: "relative", display: "inline-block"}}>
                                    {userDetails.avatar ? (
                                        <Avatar
                                            size="large"
                                            src={userDetails.avatar}
                                            style={{cursor: "pointer"}}
                                        />
                                    ) : (
                                        <Avatar
                                            size="large"
                                            icon={<UserOutlined/>}
                                            style={{cursor: "pointer"}}
                                        />
                                    )}
                                    <DownOutlined
                                        style={{
                                            position: "absolute",
                                            bottom: 5,
                                            right: 0,
                                            fontSize: 12,
                                            fontWeight: "900",
                                            color: "#000",
                                            background: "#fff",
                                            borderRadius: "50%",
                                            padding: 2,
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                        }}
                                    />
                                </div>
                            </Dropdown>
                        ) : (
                            <Avatar
                                size="large"
                                icon={<UserOutlined/>}
                                style={{cursor: "pointer"}}
                                onClick={showLoginModal}
                            />
                        )}
                    </Tooltip>
                </Space>
            </Header>

            <LoginRequiredModal isOpen={isModalOpen} onClose={hideLoginModal}/>
        </>
    );
}
