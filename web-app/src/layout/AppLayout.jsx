import {Layout} from "antd";
import {Outlet} from "react-router-dom";
import AppHeader from "../components/AppHeader";
import SideMenu from "../components/SideMenu";

const {Sider, Content} = Layout;

function MainLayout() {
    return (
        <Layout
            style={{
                minHeight: "100vh",
                width: "100%",
            }}
        >
            {/* Header */}
            <AppHeader/>

            <Layout style={{flexDirection: "row"}}>
                {/* Side Menu */}
                <Sider
                    width={250} // Độ rộng sidebar
                    style={{
                        background: "#fff",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                        position: "fixed",
                        top: 64,
                        height: "calc(100vh - 64px)",
                        overflow: "auto",
                    }}
                >
                    <SideMenu/>
                </Sider>

                {/* Nội dung chính */}
                <Layout
                    style={{
                        width: "100%",
                        padding: "24px",
                        marginLeft: 250,
                        backgroundColor: "#F2F4F7"
                    }}
                >
                    <Content
                        style={{
                            background: "transparent",
                            minHeight: "auto",
                        }}
                    >
                        <div
                            style={{
                                // background: "#fff",
                                // padding: 24,
                                minHeight: "calc(100vh - 112px)",
                            }}
                        >
                            <Outlet/>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default MainLayout;
