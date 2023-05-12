import { Link, useNavigate } from 'react-router-dom';

function EmailVerification() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login')
  }
  const url = "https://www.techslang.com/wp-content/uploads/2021/06/Untitled-1-3.jpg";
  return (
    // <div>
    //   <p>Tài khoản của bạn đã được xác thực. Bạn có thể đăng nhập và sử dụng chương trình</p>
    //   <button onClick={handleLogin} className='btn btn-outline-secondary'>login</button>
    // </div>
    <div className="verify-page">
      <div className="verify-container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row border-0 rounded-4 p-3 bg-white shadow box-area-verify">
          <div className='d-flex justify-content-center align-items-center'>
            <img src={url} width={400}/>
          </div>
          <div className='d-flex justify-content-center'>
            <h2>Email verified successfully</h2>
          </div>
          <div className='d-flex justify-content-center'>
          <div className="col-md-12 text-center">
            <p>Tài khoản của bạn đã được xác thực thành công</p>
            <p>Bạn có thể đăng nhập và sử dụng chương trình ngay bây giờ</p>
          </div>
          </div>
          <div className='d-flex justify-content-center align-items-center'>
            <button onClick={handleLogin} className='btn btn-outline-secondary fw-bold'>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;