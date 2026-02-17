import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { uid, email, type, name }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // In a real app, we'd fetch the user role from Firestore here.
                // For this demo, we'll try to recover the role from localStorage 
                // or default to 'user' if not found (fallback).
                const storedRoleData = localStorage.getItem(`role_${firebaseUser.uid}`);
                const roleData = storedRoleData ? JSON.parse(storedRoleData) : { type: 'user', name: firebaseUser.displayName || 'User' };

                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    ...roleData
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email, password, name, type) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });

        // Persist role locally for this demo since we aren't using Firestore yet
        const roleData = { type, name };
        localStorage.setItem(`role_${userCredential.user.uid}`, JSON.stringify(roleData));

        setUser({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            ...roleData
        });
        return userCredential.user;
    };

    const login = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = async (role) => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if role data exists, if not, save it
        let roleData = localStorage.getItem(`role_${user.uid}`);
        if (!roleData) {
            roleData = JSON.stringify({ type: role, name: user.displayName || 'User' });
            localStorage.setItem(`role_${user.uid}`, roleData);
        }

        return user;
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
