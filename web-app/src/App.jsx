import {ConfigProvider} from "antd";
import AppRoutes from "./routes/AppRoutes";
import {UserProvider} from "./contexts/UserContext";
import {AuthProvider} from "./contexts/AuthProvider";

function App() {
    return (
        <ConfigProvider>
            <AuthProvider>
                <UserProvider>
                    <AppRoutes/>
                </UserProvider>
            </AuthProvider>
        </ConfigProvider>
    );
}

export default App;
