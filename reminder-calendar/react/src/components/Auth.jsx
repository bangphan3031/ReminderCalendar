import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Auth(WrappedComponent) {
  return function withAuth(props) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      if (accessToken) {
        setAuthenticated(true);
      }
      setLoading(false); // đánh dấu useEffect đã hoàn thành
    }, []);

    if (loading) { // kiểm tra xem useEffect đã hoàn thành hay chưa
      return null; // hoặc hiển thị spinner, message loading, vv.
    }

    if (authenticated) {
      return <WrappedComponent {...props} />;
    } else {
      return <Navigate to="/login" />;
    }
  }
}

export default Auth;
