export const decodeToken = (token) => {
    if (!token) return null;
    
    try {
      const base64Payload = token.split('.')[1];
      // Decode base64 để lấy JSON string
      const payload = window.atob(base64Payload);
      // Parse JSON string thành object
      return JSON.parse(payload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  

  export const isTokenExpired = (token) => {
    const decodedToken = decodeToken(token);
    if (!decodedToken) return true;
    
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    
    return currentTime >= expirationTime;
  };
  

  export const getTokenRemainingTime = (token) => {
    const decodedToken = decodeToken(token);
    if (!decodedToken) return 0;
    
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    
    if (currentTime >= expirationTime) return 0;
    
    return Math.floor((expirationTime - currentTime) / 1000); // Convert to seconds
  };

  export const getClaimFromToken = (token, key) => {
    const decodedToken = decodeToken(token);
    if (!decodedToken) return undefined;
    
    return decodedToken[key];
  };