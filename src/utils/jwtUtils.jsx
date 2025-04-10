
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const base64Payload = token.split('.')[1];
    // Some extra checks to ensure valid token format
    if (!base64Payload) {
      throw new Error('Invalid token format');
    }
    
    // Fix base64 padding if needed
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const base64Corrected = base64 + padding;
    
    // Decode base64 to get JSON string
    const payload = window.atob(base64Corrected);
    // Parse JSON string to object
    return JSON.parse(payload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};


export const isTokenExpired = (token) => {
  const decodedToken = decodeToken(token);
  if (!decodedToken || !decodedToken.exp) return true;
  
  const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const bufferTime = 5000; // 5 second buffer to account for network latency
  
  return currentTime >= (expirationTime - bufferTime);
};


export const getTokenRemainingTime = (token) => {
  const decodedToken = decodeToken(token);
  if (!decodedToken || !decodedToken.exp) return 0;
  
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