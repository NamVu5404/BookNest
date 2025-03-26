import {useLocation} from "react-router-dom";
import EmailVerificationForm from "../../components/EmailVerificationForm";

export default function VerifyEmail() {
    const location = useLocation();
    const email = location.state?.email;
    const userCreateData = location.state?.userCreateData;

    return (
        <EmailVerificationForm
            email={email}
            context="registration"
            userCreateData={userCreateData}
        />
    );
}
