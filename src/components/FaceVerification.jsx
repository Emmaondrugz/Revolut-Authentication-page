"use client"
import React, { useEffect, useRef, useState } from "react";
import '../app/globals.css'

export default function FaceVerification() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [cameraError, setCameraError] = useState(null);

    // Start the camera when the component mounts
    useEffect(() => {
        // Make sure we're running in the browser environment
        if (typeof window === 'undefined') return;

        const startCamera = async () => {
            try {
                setCameraError(null);
                
                // Check if mediaDevices API is available
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error("Your browser doesn't support camera access. Please try a different browser.");
                }
                
                // Request camera access
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        facingMode: "user",
                        width: { ideal: 1280 },
                        height: { ideal: 720 } 
                    } 
                });
                
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    
                    // Make sure the video is loaded before we try to play it
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play().catch(e => {
                            console.error("Error playing video:", e);
                            setCameraError("Could not play video stream. Please check permissions.");
                        });
                    };
                }
            } catch (error) {
                console.error("Error accessing the camera:", error);
                
                if (error.name === 'NotAllowedError') {
                    setCameraError("Camera access denied. Please enable camera permissions.");
                } else if (error.name === 'NotFoundError') {
                    setCameraError("No camera found on your device.");
                } else {
                    setCameraError(`Camera error: ${error.message}`);
                }
            }
        };

        // Delay starting the camera to ensure the component is fully mounted
        const timeoutId = setTimeout(() => {
            startCamera();
        }, 500);

        // Cleanup: Stop the camera when the component unmounts
        return () => {
            clearTimeout(timeoutId);
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    // Function to capture image
    const captureImage = () => {
        if (cameraError) return;
        
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
                try {
                    const imageData = canvas.toDataURL('image/png');
                    console.log("Captured image:", imageData);
                } catch (e) {
                    console.error("Error capturing image:", e);
                }

                setIsCapturing(false);
            }
        }, 300);
    };

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden">
            {/* Browser environment check */}
            {typeof window === 'undefined' ? (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                    Loading camera...
                </div>
            ) : (
                <>
                    {/* Main Camera Feed (dimmed background) */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute top-0 left-0 w-full h-full object-cover opacity-25"
                    />

                    {/* Hidden canvas for image capture */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Black overlay to darken the video further */}
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>

                    {/* Header with Back Button and "Selfie" text */}
                    <div className="absolute top-0 left-0 w-full p-5 flex items-center">
                        <button
                            className="text-white z-10"
                            onClick={() => console.log("Back button clicked")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
                                <path d="m142-480 294 294q15 15 14.5 35T435-116q-15 15-35 15t-35-15L57-423q-12-12-18-27t-6-30q0-15 6-30t18-27l308-308q15-15 35.5-14.5T436-844q15 15 15 35t-15 35L142-480Z" />
                            </svg>
                        </button>
                        <p className="absolute left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold">
                            Selfie
                        </p>
                    </div>

                    {/* Camera error message */}
                    {cameraError && (
                        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg z-50 text-center max-w-xs">
                            {cameraError}
                        </div>
                    )}

                    {/* Oval Cutout Area - Moved higher up */}
                    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3 flex flex-col items-center">
                        <p className="text-white text-sm mb-10 flex items-center">
                            Powered by Revolut
                        </p>

                        {/* More oval-shaped mask with adjusted aspect ratio */}
                        <div className="relative mb-5 w-64 h-72">
                            {/* Clip path for a more oval shape rather than circle */}
                            <div
                                className="absolute inset-0 overflow-hidden border-2 border-white border-opacity-50"
                                style={{
                                    borderRadius: '50%',
                                    width: '100%',
                                    height: '100%',
                                    transform: 'scaleY(1.2)' // This makes it more oval-shaped
                                }}
                            >
                                {/* Clear video feed visible through the oval */}
                                <div className="absolute top-0 left-0 w-full h-full" style={{ transform: 'scaleY(0.833)' }}>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* "Position your face in the oval" Text */}
                        <p className="text-white text-sm -bottom-12 absolute">
                            Position your face in the oval
                        </p>
                    </div>

                    {/* iOS-style capture button at the bottom */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center">
                        <button
                            onClick={captureImage}
                            disabled={cameraError}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isCapturing ? 'bg-white bg-opacity-30 scale-90' : cameraError ? 'bg-gray-600' : 'bg-white'
                            }`}
                        >
                            <div className={`w-14 h-14 rounded-full border-2 border-gray-400 ${
                                isCapturing ? 'bg-gray-400' : 'bg-transparent'
                            }`}></div>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
