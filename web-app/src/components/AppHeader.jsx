import {
  BellOutlined,
  DownOutlined,
  LogoutOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Input, Layout, List, Space, Tooltip, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/booknest-text-logo.svg";
import { useUserDetails } from "../contexts/UserContext";
import { logOut } from "../services/authenticationService";
import LoginRequiredModal from "./LoginRequiredModal";

const { Header } = Layout;
const { Text, Title } = Typography;

export default function AppHeader() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();
  const { userDetails, updateUser } = useUserDetails();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      subject: "Đơn hàng mới",
      content: "Bạn có một đơn hàng mới từ khách hàng Nguyễn Văn A",
      time: "2 phút trước",
      read: false
    },
    {
      id: 2,
      subject: "Cập nhật hệ thống",
      content: "Hệ thống sẽ được bảo trì vào lúc 2:00 AM ngày mai",
      time: "1 giờ trước",
      read: false
    },
    {
      id: 3,
      subject: "Thanh toán thành công",
      content: "Giao dịch #12345 đã được xử lý thành công",
      time: "3 giờ trước",
      read: true
    },
    {
      id: 4,
      subject: "Tin nhắn mới",
      content: "Bạn có tin nhắn mới từ admin",
      time: "1 ngày trước",
      read: true
    },
    {
      id: 5,
      subject: "Khuyến mãi đặc biệt",
      content: "Giảm giá 50% cho tất cả sản phẩm trong tuần này",
      time: "2 ngày trước",
      read: false
    }
  ]);

  const showLoginModal = () => {
    setIsModalOpen(true);
  };

  const hideLoginModal = () => {
    setIsModalOpen(false);
  };

  const handleMenuClick = ({ key }) => {
    if (key === "profile") {
      navigate(`/profile`);
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

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined style={{ fontSize: '16px' }} />,
      label: <span style={{ fontSize: '15px' }}>Trang cá nhân</span>
    },
    {
      key: "settings",
      icon: <SettingOutlined style={{ fontSize: '16px' }} />,
      label: <span style={{ fontSize: '15px' }}>Cài đặt</span>
    },
    {
      type: 'divider'
    },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ fontSize: '16px' }} />,
      label: <span style={{ fontSize: '15px' }}>Đăng xuất</span>
    }
  ];

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const dropdownRender = () => (
    <div style={{
      width: 400,
      maxHeight: 500,
      backgroundColor: 'white',
      boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      borderRadius: '8px'
    }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>Thông báo</Title>
          <Button
            type="link"
            size="small"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ maxHeight: 350, overflowY: 'auto' }}>
        <List
          dataSource={notifications}
          split={false}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '12px 16px',
                backgroundColor: !item.read ? '#f6ffed' : 'transparent',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0'
              }}
              onClick={() => markAsRead(item.id)}
            >
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <Text strong={!item.read} style={{ fontSize: 14 }}>
                        {item.subject}
                      </Text>
                      {!item.read && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            backgroundColor: '#52c41a',
                            borderRadius: '50%',
                            marginLeft: 8
                          }}
                        />
                      )}
                    </div>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 13,
                        display: 'block',
                        marginBottom: 4,
                        lineHeight: '1.4'
                      }}
                    >
                      {item.content}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.time}
                    </Text>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>

      {/* Footer */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
        <Button type="link" size="small">
          Xem tất cả thông báo
        </Button>
      </div>
    </div>
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
          src={logo}
          alt="logo"
          height={50}
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
          }}
        />
        <Space style={{ flexGrow: 1, marginLeft: 20 }}>
          <Input
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
          />
        </Space>
        <Space size="large">
          <Dropdown
            dropdownRender={dropdownRender}
            trigger={['click']}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            <Badge
              count={unreadCount}
              offset={[-10, 10]}
              style={{
                '.ant-badge-count': {
                  boxShadow: '0 0 0 1px #fff'
                }
              }}
            >
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 20 }} />}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40
                }}
              />
            </Badge>
          </Dropdown>
          <div>
            <Tooltip title="Tài khoản">
              <div style={{ display: "inline-block" }}>
                {userDetails ? (
                  <Dropdown
                    menu={{
                      items: menuItems,
                      onClick: handleMenuClick
                    }}
                    trigger={["click"]}
                    open={menuVisible}
                    onOpenChange={setMenuVisible}
                  >
                    <div style={{ position: "relative", display: "inline-block" }}>
                      {userDetails.avatar ? (
                        <Avatar
                          size="large"
                          src={userDetails.avatar}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <Avatar
                          size="large"
                          icon={<UserOutlined />}
                          style={{ cursor: "pointer" }}
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
                    icon={<UserOutlined />}
                    style={{ cursor: "pointer" }}
                    onClick={showLoginModal}
                  />
                )}
              </div>
            </Tooltip>
          </div>
        </Space>
      </Header>

      <LoginRequiredModal isOpen={isModalOpen} onClose={hideLoginModal} />
    </>
  );
}
