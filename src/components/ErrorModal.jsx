import { useState, useEffect } from 'react';

export default function ErrorModal({ displayError, setDisplayError, displayMessage }) {
    // Handle the state of the overlay and modal box
    const [overlay, setOverlay] = useState(false);
    const [modal, setModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('+2348029886673')

    useEffect(() => {
        if (displayError) {
            // Display the overlay
            setOverlay(true);

            // After the timeout, display the modal
            setTimeout(() => {
                setModal(true);
            }, 300);
        } else {
            onMountEffect();
        }
    }, [displayError]); // Added dependency array

    // This function unmounts the whole component with transition still intact
    const onMountEffect = () => {
        setModal(false);

        // Remove the overlay after timeout
        setTimeout(() => {
            setOverlay(false);

            // Set displayError to false after timeout
            setTimeout(() => {
                setDisplayError(false);
            }, 200);
        }, 100);
    };

    return (
        <div
            className={`fixed w-full h-screen z-[100] inset-0 bg-black bg-opacity-50 justify-center items-center ${overlay ? 'flex' : 'hidden'
                }`}
        >
            {/* Main container */}
            <div
                className={`justify-between bg-[#f7f7f7] gap-y-3 items-start flex flex-col px-3 py-3 ${modal ? 'opacity-100 -translate-y-5' : 'opacity-0 translate-y-0'
                    } h-full max-h-[200px] w-full max-w-[300px] rounded-3xl transition-all duration-300`}
            >
                {/* Progress bar container */}
                <div className="w-full flex justify-center opacity-0">
                    <div className="bg-gray-200 w-[40px] h-[4px] rounded-full">
                        <div
                            className="bg-gray-400 h-full rounded-full transition-all duration-300"
                        ></div>

                    </div>
                </div>


                {/* cancel icon */}
                <div className='flex w-full justify-center items-center' onClick={
                    () => onMountEffect()
                }>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#dc2626"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" /></svg>
                </div>


                {/* Text container */}
                <div className="text-center font-medium w-full text-sm px-5">
                    {displayMessage === 'phone' ? `Incorrect passcode or phone number` : `Incorrect passcode or Email Address`}
                </div>

                {/* cancel button */}
                <div className='w-full flex shadow-md cursor-pointer justify-center text-white items-center bg-blue-600 rounded-full py-2.5' onClick={
                    () => onMountEffect()
                }>
                    Got it
                </div>
            </div>
        </div>
    );
}
