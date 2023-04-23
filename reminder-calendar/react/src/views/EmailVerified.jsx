// import { Link } from 'react-router-dom';

// function EmailVerified() {
//     return (
//         <div>
//             <p>Tài khoản của bạn đã được xác thực trước đó. Bạn có thể đăng nhập</p>
//             <Link to="/login">Đăng nhập</Link>
//         </div>
//     );
// }

// export default EmailVerified;
import axiosClient from "../axios-client.js";
import { useNavigate } from "react-router-dom";

function EmailVerified() {
    const history = useNavigate();

    const handleLogin = async () => {
    try {
        const response = await axiosClient.get("/auth/google");
        history(response.data.redirect);
    } catch (error) {
        console.error(error);
    }
    };

    return (
    <button className="btn-google" onClick={handleLogin}>
        <i className="fab fa-google"></i> Sign in with Google
    </button>
    );
}
export default EmailVerified;
