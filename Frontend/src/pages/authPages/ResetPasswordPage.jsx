import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {axiosAuth} from '../../utils/axiosClient.js';
import DarkModeToggle from '../../components/DarkModeToggle.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ResetPasswordPage() {
  const query = new URLSearchParams(window.location.search);
  const token = query.get('token');
  const id = query.get('id');

  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', isSuccess: false });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Check password strength
  useEffect(() => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', isSuccess: false });
      return;
    }

    setIsLoading(true);
    
    try {
      await axiosAuth.post('/auth/reset-password', {
        token,
        userId: id,
        newPassword: password
      });
      
      setMessage({ 
        text: 'Password reset successfully! Redirecting to login...', 
        isSuccess: true 
      });
      
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Error resetting password', 
        isSuccess: false 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen font-sans overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
      <DarkModeToggle className="absolute top-4 right-4" />

      {/* Centered Reset Password Panel */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg w-full mx-4 max-w-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2 text-center">
          Reset Your Password
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white pr-10"
                required
                minLength="8"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye/> : <FaEyeSlash />}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div className={`${passwordRequirements.length ? 'text-green-500' : ''}`}>
                • At least 8 characters
              </div>
              <div className={`${passwordRequirements.uppercase ? 'text-green-500' : ''}`}>
                • At least one uppercase letter
              </div>
              <div className={`${passwordRequirements.lowercase ? 'text-green-500' : ''}`}>
                • At least one lowercase letter
              </div>
              <div className={`${passwordRequirements.number ? 'text-green-500' : ''}`}>
                • At least one number
              </div>
              <div className={`${passwordRequirements.special ? 'text-green-500' : ''}`}>
                • At least one special character
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white pr-10"
                required
                minLength="8"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye/> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {message.text && (
            <div className={`text-center text-sm ${message.isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || password !== confirmPassword || !Object.values(passwordRequirements).every(Boolean)}
            className={`bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition ${
              isLoading || password !== confirmPassword || !Object.values(passwordRequirements).every(Boolean) 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button 
            onClick={() => navigate('/login')}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}