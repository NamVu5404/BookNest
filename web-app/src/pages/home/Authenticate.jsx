import {message, Space, Spin, Typography} from "antd";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {isAuthenticated, outboundLogin} from "../../services/authenticationService";
import {useUserDetails} from "../../contexts/UserContext";

export default function Authenticate() {
    const navigate = useNavigate();
    const {updateUser} = useUserDetails();

    useEffect(() => {
        const authCodeRegex = /code=([^&#]+)/;
        const isMatch = window.location.href.match(authCodeRegex);
        const provider = localStorage.getItem("oauth_provider");

        if (isMatch) {
            const authCode = isMatch[1];

            const handleLogin = async () => {
                try {
                    await outboundLogin(provider, authCode);
                    updateUser();
                    navigate("/");
                    localStorage.removeItem("oauth_provider");
                } catch (error) {
                    message.error(error.response?.data?.message || "Đăng nhập thất bại!");
                }
            };

            handleLogin();
        }
    }, [navigate, updateUser]);

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <Space
            direction="vertical"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Spin size="large"/>
            <Typography>Authenticating...</Typography>
        </Space>
    );
}
