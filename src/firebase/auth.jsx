import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './app';

const AuthContext = createContext({ user: null, ready: false });

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!isFirebaseConfigured() || !auth) {
            setReady(true);
            return undefined;
        }
        return onAuthStateChanged(auth, async (current) => {
            setUser(current);
            if (current) {
                localStorage.setItem('ep_token', await current.getIdToken());
            } else {
                localStorage.removeItem('ep_token');
                localStorage.removeItem('ep_refresh');
            }
            setReady(true);
        });
    }, []);

    if (!ready) {
        return <div className="empty-state">Loading...</div>;
    }

    return <AuthContext.Provider value={{ user, ready }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
