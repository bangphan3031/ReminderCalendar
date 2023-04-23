import { Link } from 'react-router-dom';

function EmailVerification() {
  return (
    <div>
      <p>Bạn đã xác thực tài khoản thành công, bạn đã có thể đăng nhập</p>
      <Link to="/login">Đăng nhập</Link>
    </div>
  );
}

export default EmailVerification;