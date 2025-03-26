import React from "react";
import {Divider, Menu} from "antd";
import {HomeOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

function SideMenu() {
    const navigate = useNavigate();

    return (
        <>
            <div style={{padding: "16px"}}/>
            <Menu mode="vertical" style={{fontWeight: "bold"}}>
                <Menu.Item
                    key="home"
                    icon={<HomeOutlined style={{fontSize: 18}}/>}
                    onClick={() => navigate("/")}
                >
                    Trang chủ
                </Menu.Item>
                <Menu.Item
                    key="friends"
                    icon={<UserOutlined style={{fontSize: 18}}/>}
                    onClick={() => navigate("/friends")}
                >
                    Bạn bè
                </Menu.Item>
                <Menu.Item
                    key="groups"
                    icon={<TeamOutlined style={{fontSize: 18}}/>}
                    onClick={() => navigate("/groups")}
                >
                    Nhóm
                </Menu.Item>
            </Menu>
            <Divider/>
        </>
    );
}

export default SideMenu;
