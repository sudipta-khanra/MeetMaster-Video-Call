import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/auth', { replace: true });
      } else {
        setCheckingAuth(false);
      }
    }, [navigate]);

    if (checkingAuth) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            bgcolor: '#f5f5f5',
          }}
        >
          <CircularProgress size={50} />
        </Box>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
