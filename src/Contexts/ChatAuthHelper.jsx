import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export function useCurrentUser() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        
        // Check all possible ID fields in your token
        let id = decoded.id || decoded.userId || decoded.sub;
        
        // If the ID exists, ensure it's the right type (number in this case)
        if (id) {
          // If the ID is not already a number, convert it
          if (typeof id !== 'number') {
            id = parseInt(id, 10);
            // Only set the ID if it's a valid number
            if (!isNaN(id)) {
              setUserId(id);
            } else {
              console.error('Invalid user ID format in token');
            }
          } else {
            setUserId(id);
          }
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { userId, loading };
}