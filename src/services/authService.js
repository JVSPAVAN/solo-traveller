import axios from 'axios';
import JSEncrypt from 'jsencrypt';
import { PUBLIC_KEY } from '../utils/publicKey';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth`;

const encryptPassword = (password) => {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(PUBLIC_KEY);
  return encryptor.encrypt(password);
};

export const login = async (email, password) => {
  try {
    const encryptedPassword = encryptPassword(password);
    if (!encryptedPassword) {
      throw new Error('Encryption failed');
    }
    const response = await axios.post(`${API_URL}/login`, {
      email,
      encryptedPassword,
    });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (email, password) => {
  try {
    const encryptedPassword = encryptPassword(password);
    const response = await axios.post(`${API_URL}/register`, {
      email,
      encryptedPassword,
    });
    // Register usually returns { id, email } but no token (unless we change backend).
    // If backend doesn't return token on register, user needs to login.
    // Let's check backend: authService.js register returns { id, email }.
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};
