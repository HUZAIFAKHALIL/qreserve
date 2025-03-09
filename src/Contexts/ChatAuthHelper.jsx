import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export function useCurrentUser() {
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id || decoded.userId); // Adjust based on your token payload structure
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserId(null);
      }
    }
  }, []);
  
  return { userId };
} 