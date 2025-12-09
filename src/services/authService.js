import axios from 'axios';
import { PUBLIC_KEY } from '../utils/publicKey';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth`;

// Helper: Convert PEM to ArrayBuffer
function pemToArrayBuffer(pem) {
  const b64Lines = pem.replace(/-----BEGIN PUBLIC KEY-----/, '')
                      .replace(/-----END PUBLIC KEY-----/, '')
                      .replace(/\n/g, '')
                      .replace(/\s/g, '');
  const str = window.atob(b64Lines);
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Helper: Import Key
async function importPublicKey(pem) {
  const binaryDer = pemToArrayBuffer(pem);
  return window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    ["encrypt"]
  );
}

// Helper: Encrypt
async function encryptPassword(password) {
  try {
    const key = await importPublicKey(PUBLIC_KEY);
    const enc = new TextEncoder();
    const encoded = enc.encode(password);
    
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      key,
      encoded
    );
    
    // Convert ArrayBuffer to Base64
    let binary = '';
    const bytes = new Uint8Array(ciphertext);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  } catch (err) {
    console.error("Encryption failed:", err);
    return null;
  }
}

export const login = async (email, password) => {
  try {
    const encryptedPassword = await encryptPassword(password);
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
    const encryptedPassword = await encryptPassword(password);
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
