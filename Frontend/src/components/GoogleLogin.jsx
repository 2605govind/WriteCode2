import { useDispatch } from 'react-redux';
import { authWithGoogle } from '../slice/authSlice.js';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

export default function GoogleLogin({setDisableAll, disableAll}) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const authTabRef = useRef(null);

    // Check if OAuth tab is closed
    useEffect(() => {
        const interval = setInterval(() => {
            if (authTabRef.current && authTabRef.current.closed) {
                setIsLoading(false);
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // setDisableAll(isLoading);
    }, [isLoading])

    const handleSuccess = async (codeResponse) => {
        try {
            setIsLoading(true);
            await dispatch(authWithGoogle({ code: codeResponse.code })).unwrap();
        } catch (error) {
            console.error('Google auth failed:', error);
        } finally {
            setIsLoading(false);
            authTabRef.current = null; // Clear the reference after success
        }
    };

    const handleError = (errorResponse) => {
        setIsLoading(false);
        authTabRef.current = null; // Clear the reference on error
        console.error('Google login error:', errorResponse);
    };

    const handleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: handleSuccess,
        onError: handleError,
        clientId: '307544145671-7rndudjqdqk3b1i6nitch2arhoulrojk.apps.googleusercontent.com',
        scope: 'email profile',
        redirect_uri: window.location.origin,
        onNonOAuthError: () => setIsLoading(false),
        onDeviceCodeSuccess: () => setIsLoading(false),
        customHandler: ({ url }) => {
            // Save the reference before opening the window
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
            if (newWindow) {
                authTabRef.current = newWindow;
            } else {
                setIsLoading(false);
            }
        }
    });

    return (
        <button
            onClick={() => {
                setIsLoading(true);
                handleLogin();
            }}
            disabled={disableAll}
            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 transition cursor-pointer dark:hover:bg-gray-500 relative"
            aria-label={isLoading ? "Signing in with Google" : "Login with Google"}
        >
            {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-red-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <FaGoogle className="text-red-500 text-xl" />
            )}
        </button>
    );
}