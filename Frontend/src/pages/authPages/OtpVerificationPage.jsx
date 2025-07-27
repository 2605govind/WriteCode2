import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import DarkModeToggle from '../../components/DarkModeToggle.jsx';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {registerUserVerifyOtp} from '../../slice/authSlice.js'

export default function OTPVerificationPage () {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigater = useNavigate();
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get('email');
  
  const {message, user, isAuthenticated} = useSelector((state) => state.auth);

  useEffect(() => {
    if(message) {
      toast.success(message);
    }
  }, [])

  useEffect(() => {
    if(isAuthenticated) {
      navigater('/');
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    const fullOtp = otp.join('');

    if(!user || !user?.email) {
      toast.error("Something went wrong");
      return;
    }

    const data = {
      email: user.email,
      otp: fullOtp,
    }

    dispatch(registerUserVerifyOtp(data));
  };

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-screen h-screen font-sans overflow-hidden bg-[#E0E0E0] dark:bg-[#121212] transition-colors duration-300 flex items-center justify-center">
      <DarkModeToggle className="absolute top-4 right-4" />

      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      {/* Centered OTP Verification Panel */}
      <div className="bg-white dark:bg-[#121212] p-8 rounded-xl shadow-lg w-full mx-4 max-w-md border border-[#B0B0B0] dark:border-[#444444]">
        <h2 className="text-2xl font-semibold text-[#121212] dark:text-[#E0E0E0] mb-2 text-center">Verify Your Email</h2>
        <p className="text-[#888888] dark:text-[#B0B0B0] mb-6 text-center">
          We've sent a 4-digit code to <span className="font-medium text-[#444444] dark:text-[#E0E0E0]">{email}</span>
        </p>

        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm text-[#888888] dark:text-[#B0B0B0] mb-2 text-center">Enter OTP</label>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl border border-[#B0B0B0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:border-[#444444] dark:text-[#E0E0E0]"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={otp.join('').length !== 4}
            className={`py-3 rounded-md transition ${
              otp.join('').length === 4
                ? 'bg-[#121212] hover:bg-[#444444] text-[#E0E0E0]'
                : 'bg-[#B0B0B0] dark:bg-[#444444] text-[#888888] dark:text-[#B0B0B0] cursor-not-allowed'
            }`}
          >
            Verify
          </button>

          <div className="text-center text-sm text-[#888888] dark:text-[#B0B0B0]">
            {!canResend ? (
              <span>Resend OTP in {formatTime(countdown)}</span>
            ) : (
              <button
                className="text-[#444444] hover:underline dark:text-[#E0E0E0]"
                onClick={() => navigater('/register')}
              >
                Go Back to Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}