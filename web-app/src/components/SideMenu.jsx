import React from "react";
import {Menu} from "antd";
import {HomeOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const SideMenu = React.forwardRef((props, ref) => {
    const navigate = useNavigate();

    const items = [
        {
            key: "home",
            icon: <HomeOutlined style={{fontSize: 18}}/>,
            label: "Trang chủ",
            onClick: () => navigate("/")
        },
        {
            key: "friends",
            icon: <UserOutlined style={{fontSize: 18}}/>,
            label: "Bạn bè",
            onClick: () => navigate("/friends")
        },
        {
            key: "groups",
            icon: <TeamOutlined style={{fontSize: 18}}/>,
            label: "Nhóm",
            onClick: () => navigate("/groups")
        }
    ];

    return (
        <div ref={ref} style={{padding: "16px 0"}}>
            <Menu
                mode="vertical"
                style={{fontWeight: "bold", border: "none"}}
                items={items}
            />
        </div>
    );
});

SideMenu.displayName = 'SideMenu';

export default SideMenu;
