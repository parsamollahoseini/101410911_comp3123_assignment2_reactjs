import api from './api';

export const authService = {
    signup: async (userData) => {
        const response = await api.post('/user/signup', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/user/login', credentials);
        if (response.data.jwt_token) {
            localStorage.setItem('token', response.data.jwt_token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export const employeeService = {
    getAll: async () => {
        const response = await api.get('/emp/employees');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/emp/employees/${id}`);
        return response.data;
    },

    create: async (employeeData) => {
        const formData = new FormData();
        Object.keys(employeeData).forEach(key => {
            formData.append(key, employeeData[key]);
        });

        const response = await api.post('/emp/employees', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    update: async (id, employeeData) => {
        const formData = new FormData();
        Object.keys(employeeData).forEach(key => {
            if (employeeData[key] !== null && employeeData[key] !== undefined) {
                formData.append(key, employeeData[key]);
            }
        });

        const response = await api.put(`/emp/employees/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/emp/employees?eid=${id}`);
        return response.data;
    },

    search: async (params) => {
        const response = await api.get('/emp/employees/search', { params });
        return response.data;
    }
};