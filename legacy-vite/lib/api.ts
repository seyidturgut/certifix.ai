const API_URL = 'http://localhost:5001/api';

export const api = {
    async getCertificates() {
        const response = await fetch(`${API_URL}/certificates`);
        if (!response.ok) throw new Error('Failed to fetch certificates');
        return response.json();
    },

    async getCertificate(id: string) {
        const response = await fetch(`${API_URL}/certificates/${id}`);
        if (!response.ok) throw new Error('Certificate not found');
        return response.json();
    },

    async issueCertificate(certData: any) {
        const response = await fetch(`${API_URL}/certificates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(certData)
        });
        if (!response.ok) throw new Error('Failed to issue certificate');
        return response.json();
    },

    async revokeCertificate(id: string) {
        const response = await fetch(`${API_URL}/certificates/${id}/revoke`, {
            method: 'PATCH'
        });
        if (!response.ok) throw new Error('Failed to revoke certificate');
        return response.json();
    },

    async login(credentials: any) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }
        return response.json();
    },

    async register(data: any) {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
        }
        return response.json();
    }
};
