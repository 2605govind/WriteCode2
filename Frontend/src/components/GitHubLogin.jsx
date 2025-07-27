import { useDispatch } from 'react-redux';
import { authWithGitHub } from '../slice/authSlice.js';
import { FaGithub } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function GitHubLogin({setDisableAll, disableAll}) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

     useEffect(() => {
            // setDisableAll(isLoading);
        }, [isLoading])

    const handleLogin = () => {
        setIsLoading(true);

        // Open GitHub auth in a popup window
        const width = 600;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const popup = window.open(
            `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&scope=read:user user:email`,
            'githubAuth',
            `width=${width},height=${height},top=${top},left=${left}`
        );

        // Poll the popup for URL changes
        const checkPopup = setInterval(() => {
            try {
                if (!popup || popup.closed) {
                    clearInterval(checkPopup);
                    setIsLoading(false);
                    return;
                }

                // Check if popup has reached callback URL
                if (popup.location.href.includes('/auth/github/callback?code=')) {
                    clearInterval(checkPopup);

                    // Extract code from URL
                    const url = new URL(popup.location.href);
                    const code = url.searchParams.get('code');

                    // Close popup
                    popup.close();

                    // Dispatch auth action
                    dispatch(authWithGitHub({ code }))
                        .unwrap()
                        .finally(() => setIsLoading(false));
                    // console.log('code', code);
                }
            } catch (e) {
                // Cross-origin errors will occur until callback URL matches
                // This is expected behavior
            }
        }, 100);
    };

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
                <FaGithub className="text-red-500 text-xl" />
            )}
        </button>
    );
}