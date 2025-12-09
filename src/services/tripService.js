import axios from 'axios';
import { getCurrentUser } from './authService';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips`;

const getAuthHeader = () => {
    const user = getCurrentUser();
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

export const getTrips = async () => {
    try {
        const response = await axios.get(API_URL, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching trips:", error);
        throw error;
    }
};

export const createTrip = async (tripData) => {
    try {
        const response = await axios.post(API_URL, tripData, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error creating trip:", error);
        throw error;
    }
};

export const updateTrip = async (id, tripData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, tripData, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error updating trip:", error);
        throw error;
    }
};

export const deleteTrip = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
        return true;
    } catch (error) {
        console.error("Error deleting trip:", error);
        throw error;
    }
};
