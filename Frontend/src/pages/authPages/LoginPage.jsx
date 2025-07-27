import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import DarkModeToggle from '../../components/DarkModeToggle.jsx';
import { useForm } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../slice/authSlice.js';
import { toast, Toaster } from 'react-hot-toast';
import GoogleLogin from '../../components/GoogleLogin.jsx';
import GitHubLogin from '../../components/GitHubLogin.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const loginSchema = z.object({
  loginId: z.string().trim().refine(
    (val) =>
      /^[a-zA-Z0-9_]{3,}$/.test(val) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    {
      message: "Must be a valid email or username",
    }
  ),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [disableAll, setDisableAll] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error, loading } = useSelector((state) => state.auth);
  const fullText = "Your ultimate coding platform";
  const features = [
  "✔ Online Code Editor",
  "✔ Problems Filter (Tags & Companies)",
  "✔ Code Submission & Evaluation",
  "✔ Courses & Learning Paths"
];

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setDisableAll(false);
    }
  }, [error]);

  useEffect(() => {
    // Typewriter effect for the main text
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);

    return () => clearInterval(typing);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  function onSubmitForm(data) {
    setDisableAll(true);
    let userData = null;

    if (data.loginId.includes('@')) {
      userData = {
        email: data.loginId,
        password: data.password
      }
    } else {
      userData = {
        userName: data.loginId,
        password: data.password
      }
    }

    dispatch(loginUser(userData));
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="relative flex flex-col-reverse md:flex-row w-screen md:h-screen font-sans overflow-hidden bg-[#E0E0E0] dark:bg-[#121212] transition-colors duration-300">
        <DarkModeToggle />

        <Toaster
          position="top-center"
          reverseOrder={false}
        />

        {/* Right Panel (Login) */}
        <div className="w-full md:w-[40%] flex items-center justify-center bg-[#E0E0E0] dark:bg-[#121212] order-1 md:order-2">
          <div className="bg-white dark:bg-[#121212] p-10 rounded-xl shadow-lg w-full md:mx-4 md:max-w-md border border-[#B0B0B0] dark:border-[#444444]">
            <h2 className="text-2xl font-semibold text-[#121212] dark:text-[#E0E0E0] mb-6">Login To WriteCode</h2>

            <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username or E-mail"
                  disabled={disableAll}
                  className={`${errors.loginId ? 'border-red-500' : 'border-[#B0B0B0]'} w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:border-[#444444] dark:text-[#E0E0E0] dark:[color-scheme:dark] dark:autofill:bg-[#121212] disabled:opacity-70 disabled:cursor-not-allowed`}
                  required
                  {...register('loginId')}
                />
                {errors.loginId && (
                  <span className="text-red-400 text-sm mt-1">{errors.loginId.message}</span>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    disabled={disableAll}
                    className={`${errors.password ? 'border-red-500' : 'border-[#B0B0B0]'} w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:border-[#444444] dark:text-[#E0E0E0] dark:[color-scheme:dark] dark:autofill:bg-[#121212] disabled:opacity-70 disabled:cursor-not-allowed`}
                    required
                    {...register('password')}
                  />
                  <button
                    type="button"
                    disabled={disableAll}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#444444] dark:text-[#E0E0E0] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-400 text-sm mt-1">{errors.password.message}</span>
                )}
              </div>

              <div className="flex justify-end text-sm text-[#888888] dark:text-[#B0B0B0]">
                <Link 
                  to={'/forgotpassword'} 
                  className={`text-[#444444] hover:underline dark:text-[#E0E0E0] ${disableAll ? 'pointer-events-none opacity-50' : ''}`}
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={disableAll || loading}
                className={`bg-[#121212] text-[#E0E0E0] py-2 rounded-md hover:bg-[#444444] transition disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#121212]`}
              >
                {disableAll || loading ? 'Processing...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-sm text-[#888888] dark:text-[#B0B0B0] mt-4">
              Don't have an account?{' '}
              <Link 
                to={'/register'} 
                className={`text-[#444444] hover:underline dark:text-[#E0E0E0] ${disableAll ? 'pointer-events-none opacity-50' : ''}`}
              >
                Register
              </Link>
            </p>

            {/* Social Login */}
            <div className="flex justify-center items-center space-x-6 mt-6">
              <GoogleLogin disableAll={disableAll} setDisableAll={setDisableAll} />
              <GitHubLogin disableAll={disableAll} setDisableAll={setDisableAll} />
            </div>
          </div>
        </div>

        {/* Left Panel (Info) */}
        <div className="w-full md:w-[60%] bg-[#121212] text-[#E0E0E0] p-12 flex flex-col justify-center order-2 md:order-1 relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#444444] to-[#121212] opacity-90 animate-gradient-shift"></div>
          
          <div className="max-w-xl mx-auto text-center md:text-left relative z-10">
            <h1 className="text-4xl font-bold mb-2 animate-fade-in">WriteCode</h1>
            <p className="text-lg mb-6 h-8 animate-fade-in">
              {typedText}
              <span className="ml-1 inline-block w-1 h-6 bg-[#E0E0E0] animate-blink">|</span>
            </p>
            <ul className="space-y-3 text-base">
              {features.map((feature, index) => (
                <li 
                  key={index} 
                  className="opacity-0 animate-feature-in"
                  style={{ animationDelay: `${1500 + (index * 300)}ms` }}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}