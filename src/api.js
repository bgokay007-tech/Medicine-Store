const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:4000/api');

let refreshPromise = null;

function clearSession() {
    localStorage.removeItem('ep_token');
    localStorage.removeItem('ep_refresh');
}

async function refreshAccess() {
    const refreshToken = localStorage.getItem('ep_refresh');
    if (!refreshToken) return false;
    if (!refreshPromise) {
        refreshPromise = fetch(`${API}/user/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        })
            .then(async (response) => {
                const data = await response.json().catch(() => ({}));
                if (!response.ok || !data.token) throw new Error(data.message || 'Refresh failed');
                localStorage.setItem('ep_token', data.token);
                if (data.refreshToken) localStorage.setItem('ep_refresh', data.refreshToken);
                return true;
            })
            .catch(() => {
                clearSession();
                return false;
            })
            .finally(() => { refreshPromise = null; });
    }
    return refreshPromise;
}

export async function request(path, options = {}) {
    const token = localStorage.getItem('ep_token');
    const response = await fetch(`${API}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        if (response.status === 401 && !options._retry && path !== '/user/login' && path !== '/user/refresh') {
            const refreshed = await refreshAccess();
            if (refreshed) return request(path, { ...options, _retry: true });
            window.location.assign('/login');
        }
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
}
