import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { axiosAuth } from '../../utils/axiosClient.js';
import DarkModeToggle from '../../components/DarkModeToggle.jsx';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [message, setMessage] = useState({ text: '', isSuccess: false });
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    try {
      await axiosAuth.post('/auth/forgot-password', { email });
      setMessage({ 
        text: 'If this email exists, a reset link has been sent', 
        isSuccess: true 
      });
      setIsSubmitted(true);
      setCountdown(30); // 30 seconds countdown
      setCanResend(false);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Error sending reset link', 
        isSuccess: false 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await axiosAuth.post('/auth/forgot-password', { email });
      setMessage({ 
        text: 'Reset link resent successfully', 
        isSuccess: true 
      });
      setCountdown(30);
      setCanResend(false);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Error resending reset link', 
        isSuccess: false 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format countdown to seconds
  const formatTime = (seconds) => {
    return `${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-screen h-screen font-sans overflow-hidden bg-[#E0E0E0] dark:bg-[#121212] transition-colors duration-300 flex items-center justify-center">
      <DarkModeToggle />

      {/* Centered Forgot Password Panel */}
      <div className="bg-white dark:bg-[#121212] p-8 rounded-xl shadow-lg w-full mx-4 max-w-md border border-[#B0B0B0] dark:border-[#444444]">
        <h2 className="text-2xl font-semibold text-[#121212] dark:text-[#E0E0E0] mb-2 text-center">
          {isSubmitted ? 'Check Your Email' : 'Forgot Password'}
        </h2>
        
        {!isSubmitted ? (
          <>
            <p className="text-[#888888] dark:text-[#B0B0B0] mb-6 text-center">
              Enter your email to receive a password reset link
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-[#B0B0B0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:border-[#444444] dark:text-[#E0E0E0] dark:[color-scheme:dark]"
                  required
                  disabled={isLoading}
                />
              </div>

              {message.text && (
                <div className={`text-center text-sm ${message.isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`bg-[#121212] text-[#E0E0E0] py-3 rounded-md hover:bg-[#444444] transition disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#121212]`}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link 
                to="/login" 
                className="font-medium text-[#444444] hover:underline dark:text-[#E0E0E0] dark:hover:text-[#B0B0B0]"
              >
                Remember your password? Sign in
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-[#888888] dark:text-[#B0B0B0] mb-6 text-center">
              We've sent a password reset link to <span className="font-medium text-[#444444] dark:text-[#E0E0E0]">{email}</span>
            </p>

            {message.text && (
              <div className={`text-center text-sm mb-4 ${message.isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                {message.text}
              </div>
            )}

            <div className="text-center text-sm text-[#888888] dark:text-[#B0B0B0] mb-4">
              {!canResend ? (
                <span>Resend link in {formatTime(countdown)} seconds</span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className={`text-[#444444] hover:underline dark:text-[#E0E0E0] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Sending...' : 'Resend Link'}
                </button>
              )}
            </div>

            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full text-[#444444] dark:text-[#E0E0E0] hover:underline mt-4"
            >
              Use a different email
            </button>
          </>
        )}
      </div>
    </div>
  );
}