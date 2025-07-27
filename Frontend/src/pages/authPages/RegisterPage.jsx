import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaGithub } from 'react-icons/fa';
import DarkModeToggle from '../../components/DarkModeToggle.jsx';
import { useForm } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../slice/authSlice.js'
import { toast, Toaster } from 'react-hot-toast';
import GoogleLogin from '../../components/GoogleLogin.jsx';
import GitHubLogin from '../../components/GitHubLogin.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const registerSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigater = useNavigate();
  const dispatch = useDispatch();
  const { loading, user, error } = useSelector((state) => state.auth);
  const [disableAll, setDisableAll] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = "Your ultimate coding platform";
    const features = [
  "✔ Online Code Editor",
  "✔ Problems Filter (Tags & Companies)",
  "✔ Code Submission & Evaluation",
  "✔ Courses & Learning Paths"
];

  useEffect(() => {
    if (user?.email) {
      toast.success("Registration successful!");
      navigater('/register/otpverify')
    }

    if (error) {
      setDisableAll(false);
    }
  }, [user, error])

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
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  function onSubmitForm(data) {
    setDisableAll(true);
    dispatch(registerUser(data));
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="relative flex flex-col-reverse md:flex-row w-screen md:h-screen font-sans overflow-hidden bg-[#E0E0E0] dark:bg-[#121212] transition-colors duration-300">
        <DarkModeToggle className="absolute top-4 right-4" />

        <Toaster
          position="top-center"
          reverseOrder={false}
        />

        {/* Right Panel (Login) */}
        <div className="w-full md:w-[40%] flex items-center justify-center bg-[#E0E0E0] dark:bg-[#121212] order-1 md:order-2">
          <div className="bg-white dark:bg-[#121212] p-10 rounded-xl shadow-lg w-full md:mx-4 md:max-w-md border border-[#B0B0B0] dark:border-[#444444]">
            <h2 className="text-2xl font-semibold text-[#121212] dark:text-[#E0E0E0] mb-6">Register To WriteCode</h2>

            <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  disabled={disableAll}
                  className={`${errors.fullName ? 'border-red-500' : 'border-[#B0B0B0]'} w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:border-[#444444] dark:text-[#E0E0E0] dark:[color-scheme:dark] dark:autofill:bg-[#121212] disabled:opacity-70 disabled:cursor-not-allowed`}
                  required
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <span className="text-red-400 text-sm mt-1">{errors.fullName.message}</span>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  disabled={disableAll}
                  className={`${errors.email ? 'border-red-500' : 'border-[#B0B0B0]'} w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:border-[#444444] dark:text-[#E0E0E0] dark:[color-scheme:dark] dark:autofill:bg-[#121212] disabled:opacity-70 disabled:cursor-not-allowed`}
                  required
                  {...register('email')}
                />
                {errors.email && (
                  <span className="text-red-400 text-sm mt-1">{errors.email.message}</span>
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
                {disableAll || loading ? 'Processing...' : 'Register'}
              </button>
            </form>

            <p className="text-center text-sm text-[#888888] dark:text-[#B0B0B0] mt-4">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className={`text-[#444444] dark:text-[#E0E0E0] hover:underline ${disableAll ? 'pointer-events-none opacity-50' : ''}`}
              >
                Login
              </Link>
            </p>

            {/* Social Login */}
            <div className="flex justify-center items-center space-x-6 mt-6">
              <GoogleLogin disableAll={disableAll} setDisableAll={setDisableAll}  />
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