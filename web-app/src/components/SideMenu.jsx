import React, { useState } from "react";
import { Menu } from "antd";
import { HomeOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getUid } from "../services/localStorageService";

const SideMenu = React.forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState(["friends"]); // Mở submenu "Bạn bè" mặc định

  const items = [
    {
      key: "home",
      icon: <HomeOutlined style={{ fontSize: 18 }} />,
      label: <span style={{ fontSize: '15px' }}>Trang chủ</span>,
      onClick: () => navigate("/")
    },
    {
      key: "friends",
      icon: <UserOutlined style={{ fontSize: 18 }} />,
      label: <span style={{ fontSize: '15px' }}>Bạn bè</span>,
      children: [
        {
          key: "suggestions",
          label: <span style={{ fontSize: '15px' }}>Gợi ý</span>,
          onClick: () => navigate("/friends/suggestions")
        },
        {
          key: "all-friends",
          label: <span style={{ fontSize: '15px' }}>Tất cả bạn bè</span>,
          onClick: () => navigate(`users/${getUid()}/friends`)
        },
        {
          key: "friend-requests",
          label: <span style={{ fontSize: '15px' }}>Lời mời kết bạn</span>,
          onClick: () => navigate("/friends/requests/received")
        },
        {
          key: "pending-acceptance",
          label: <span style={{ fontSize: '15px' }}>Đang chờ chấp nhận</span>,
          onClick: () => navigate("/friends/requests/sent")
        }
      ]
    },
    {
      key: "groups",
      icon: <TeamOutlined style={{ fontSize: 18 }} />,
      label: <span style={{ fontSize: '15px' }}>Nhóm</span>,
      onClick: () => navigate("/groups")
    }
  ];

  return (
    <div ref={ref} style={{ padding: "16px 0" }}>
      <Menu
        mode="inline"
        style={{ fontWeight: "bold", border: "none" }}
        items={items}
        openKeys={openKeys} // Mở sẵn submenu "Bạn bè"
        onOpenChange={(keys) => setOpenKeys(keys)} // Xử lý khi mở/đóng submenu
      />
    </div>
  );
});

SideMenu.displayName = 'SideMenu';

export default SideMenu;
