'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { FcGoogle } from 'react-icons/fc';
import Checkbox from 'components/checkbox';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

function SignInDefault() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [testOtp, setTestOtp] = useState('');

  const BASE_URL = 'http://192.168.29.178:8000';

  const handleSendOtp = async () => {
    if (!emailOrPhone) {
      setError('Please enter your email or phone number.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/api/v1/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_or_phone: emailOrPhone,
          role: 'ADMIN',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStep(2);
        if (result.data?.test_otp) {
          setTestOtp(result.data.test_otp);
        }
      } else {
        setError(result.message || 'Bad Request: Invalid format or missing parameters.');
      }
    } catch (err) {
      setError('Failed to connect to the authentication server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLogin = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/api/v1/auth/login-with-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_or_phone: emailOrPhone,
          otp: otp,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('accessToken', result.data.accessToken);
        localStorage.setItem('refreshToken', result.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        localStorage.setItem('admin_session', result.data.user.email);
        
        router.push('/admin/dashboard');
      } else {
        // Handle specific error codes
        if (response.status === 401) {
          setError('Unauthorized: Invalid OTP or account blocked.');
        } else if (response.status === 404) {
          setError('Not Found: Account does not exist.');
        } else {
          setError(result.message || 'Bad Request: Invalid format or missing parameters.');
        }
      }
    } catch (err) {
      setError('Failed to authenticate with the security server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Default
      maincard={
        <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
          {/* Sign in section */}
          <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
            <div className="mb-8 flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/20">
                A
              </div>
              <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
                Admin <span className="font-medium text-gray-400 text-lg uppercase tracking-widest">Auth</span>
              </h3>
            </div>

            <h3 className="mb-2.5 text-4xl font-black text-navy-700 dark:text-white uppercase tracking-tight italic">
              {step === 1 ? 'Administrator Access' : 'Security Shield'}
            </h3>
            <p className="mb-9 ml-1 text-base text-gray-600 font-medium italic">
              {step === 1 
                ? 'Enter your credentials to receive an authentication pulse.' 
                : `A security code has been transmitted to your ${emailOrPhone.includes('@') ? 'email' : 'device'}.`}
            </p>

            {error && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-xs font-black text-red-500 uppercase tracking-widest leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            {testOtp && step === 2 && (
              <div className="mb-6 rounded-xl bg-brand-50 p-4 border border-brand-100 flex items-center justify-between shadow-sm">
                <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest">Dev Test OTP:</p>
                <p className="text-sm font-black text-brand-600">{testOtp}</p>
              </div>
            )}
            
            {/* Step 1: Identification */}
            {step === 1 && (
              <InputField
                variant="auth"
                extra="mb-6"
                label="Identifier (Email or Phone)"
                placeholder="admin@example.com or +91..."
                id="identifier"
                type="text"
                value={emailOrPhone}
                onChange={(e: any) => setEmailOrPhone(e.target.value)}
              />
            )}

            {/* Step 2: Verification */}
            {step === 2 && (
              <InputField
                variant="auth"
                extra="mb-6"
                label="Verification OTP"
                placeholder="Enter 6-digit code"
                id="otp"
                type="text"
                value={otp}
                onChange={(e: any) => setOtp(e.target.value)}
              />
            )}

            <button 
              onClick={step === 1 ? handleSendOtp : handleVerifyLogin}
              disabled={isLoading}
              className={`linear w-full rounded-2xl py-4 text-sm font-black text-white transition duration-300 shadow-xl uppercase tracking-widest ${
                isLoading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-brand-500 hover:bg-brand-600 active:scale-95 shadow-brand-500/20'
              }`}
            >
              {isLoading ? 'Transmitting...' : step === 1 ? 'Get OTP Pulse' : 'Authenticate Session'}
            </button>

            {step === 2 && (
              <button 
                onClick={() => setStep(1)}
                className="mt-4 w-full text-xs font-black text-gray-400 hover:text-navy-700 uppercase tracking-widest transition-colors"
              >
                ← Edit Credentials
              </button>
            )}
            
            <div className="mt-8 text-center border-t border-gray-100 pt-6 dark:border-white/10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-50">
                Encrypted Session Management Layer v1.0
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default SignInDefault;
