import {useLocation} from "react-router-dom";
import EmailVerificationForm from "../../components/EmailVerificationForm";

export default function VerifyResetPassword() {
    const location = useLocation();
    const email = location.state?.email;

    return <EmailVerificationForm email={email} context="resetPassword"/>;
}
