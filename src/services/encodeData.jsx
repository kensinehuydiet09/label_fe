import Constants from '@/constants';
import CryptoJS from 'crypto-js';

// Lấy secret key từ biến môi trường
const SECRET_KEY = Constants.K8 || '00000000000000';

export const encodeData = (data) => {
  if (!data) return null;
  
  // Chuyển đổi object thành JSON string
  const jsonString = JSON.stringify(data);
  
  // Mã hóa sử dụng AES
  const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
  
  return encrypted;
};


export const isFileOrBlob = (value) => {
  return value instanceof File || value instanceof Blob;
};


export const encodeFormData = (data) => {
  if (!data) return null;
  
  const encodedData = {};
  
  // Duyệt qua tất cả các khóa trong object
  Object.keys(data).forEach(key => {
    // Nếu là File hoặc Blob, giữ nguyên
    if (isFileOrBlob(data[key])) {
      encodedData[key] = data[key];
    } else {
      // Nếu không, mã hóa giá trị
      const valueToEncode = typeof data[key] === 'object' 
        ? JSON.stringify(data[key]) 
        : String(data[key]);
      encodedData[key] = encodeData({ value: valueToEncode });
    }
  });
  
  return encodedData;
};

export default {
  encodeData,
  encodeFormData,
  isFileOrBlob
};