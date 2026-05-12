'use client';
import React, { useState } from 'react';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { useRouter } from 'next/navigation';

function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Save to local storage for our mock authentication
    localStorage.setItem('admin_email', email);
    localStorage.setItem('admin_password', password);
    
    alert('Admin account created successfully! Please sign in.');
    router.push('/auth/sign-in');
  };

  return (
    <Default
      maincard={
        <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
          <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
            <div className="mb-8 flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-xl">
                H
              </div>
              <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
                Admin <span className="font-medium text-gray-400 text-lg">Setup</span>
              </h3>
            </div>

            <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
              Create Admin
            </h3>
            <p className="mb-9 ml-1 text-base text-gray-600">
              Set up your master administrator credentials.
            </p>
            
            <InputField
              variant="auth"
              extra="mb-4"
              label="Email Address"
              placeholder="admin@example.com"
              id="email"
              type="text"
              onChange={(e: any) => setEmail(e.target.value)}
            />

            <InputField
              variant="auth"
              extra="mb-4"
              label="Create Password"
              placeholder="Your secure password"
              id="password"
              type="password"
              onChange={(e: any) => setPassword(e.target.value)}
            />

            <InputField
              variant="auth"
              extra="mb-6"
              label="Confirm Password"
              placeholder="Repeat your password"
              id="confirm-password"
              type="password"
              onChange={(e: any) => setConfirmPassword(e.target.value)}
            />

            <button 
              onClick={handleSignUp}
              className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 shadow-lg shadow-brand-500/20"
            >
              Initialize Admin Account
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-navy-700 dark:text-gray-500">
                Already have an account? 
                <a href="/auth/sign-in" className="ml-1 text-brand-500 hover:text-brand-600 font-bold">Sign In</a>
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default SignUp;
