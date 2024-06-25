import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAdmin = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.admin) {
          router.push('/auth/login');
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        try {
          await axios.get('http://localhost:3001/auth/verify-token', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAdmin(true);
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/auth/login');
        } finally {
          setIsLoading(false);
        }
      };

      checkAdmin();
    }, []);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAdmin) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
