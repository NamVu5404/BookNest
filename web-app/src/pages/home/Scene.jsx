import React, {useState} from "react";
import {Button, Drawer, Layout} from "antd";
import {MenuOutlined} from "@ant-design/icons";
import Header from "../../components/AppHeader";
import SideMenu from "../../components/SideMenu";

const {Header: AntHeader, Sider, Content} = Layout;
const drawerWidth = 300;

function Scene({children}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Layout style={{minHeight: "100vh"}}>
            {/* HEADER */}
            <AntHeader
                style={{
                    position: "fixed",
                    width: "100%",
                    zIndex: 1000,
                    padding: "0 16px",
                    background: "#001529",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                {/* Mobile Menu Button */}
                <Button
                    type="text"
                    icon={<MenuOutlined/>}
                    onClick={handleDrawerToggle}
                    style={{fontSize: "18px", color: "#fff", display: "none"}}
                    className="menu-button"
                />
                <Header/>
            </AntHeader>

            <Layout>
                {/* SIDEBAR */}
                <Sider
                    width={drawerWidth}
                    style={{
                        background: "#fff",
                        height: "100vh",
                        position: "fixed",
                        left: 0,
                        top: 64,
                        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
                    }}
                    className="sidebar"
                    breakpoint="md"
                    collapsedWidth="0"
                >
                    <SideMenu/>
                </Sider>

                {/* MOBILE DRAWER */}
                <Drawer
                    title="Menu"
                    placement="left"
                    closable
                    onClose={handleDrawerToggle}
                    open={mobileOpen}
                    width={drawerWidth}
                    bodyStyle={{padding: 0}}
                >
                    <SideMenu/>
                </Drawer>

                {/* MAIN CONTENT */}
                <Layout style={{marginLeft: drawerWidth, transition: "0.3s"}}>
                    <Content style={{padding: "80px 24px"}}>{children}</Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default Scene;
