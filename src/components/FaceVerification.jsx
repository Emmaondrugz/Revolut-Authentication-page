"use client"
import React, { useEffect, useRef, useState } from "react";

export default function FaceVerification() {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);

    // Camera initialization
    useEffect(() => {
        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { 
                        facingMode: "user",
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                });
                
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => videoRef.current.play();
                }
            } catch (err) {
                setError(err.name === 'NotAllowedError' 
                    ? "Camera access denied. Please enable permissions."
                    : "Camera unavailable. Please check your device.");
            }
        };

        initCamera();
        return () => videoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
    }, []);

    const capturePhoto = async () => {
        setIsCapturing(true);
        const canvas = document.createElement('canvas');
        const video = videoRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        // Rotate image for mobile orientation
        const rotated = await rotateImage(canvas.toDataURL('image/jpeg'));
        localStorage.setItem('faceCapture', rotated);
        window.location.href = '/verification-result';
        
        setIsCapturing(false);
    };

    const rotateImage = (dataUrl) => {
        return new Promise(resolve => {
            const img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                [canvas.width, canvas.height] = [img.height, img.width];
                
                const ctx = canvas.getContext('2d');
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.rotate(Math.PI/2);
                ctx.drawImage(img, -img.width/2, -img.height/2);
                
                resolve(canvas.toDataURL('image/jpeg'));
            };
        });
    };

    return (
        <div className="relative h-screen bg-black flex flex-col">
            {/* Camera Preview */}
            <video 
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-50"
            />

            {/* UI Overlay */}
            <div className="relative z-10 flex-1 flex flex-col">
                {/* Header */}
                <header className="p-4 flex items-center bg-black/50">
                    <button className="text-white">
                        <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z"/></svg>
                    </button>
                    <h1 className="text-white text-center flex-1 text-lg font-medium">
                        Face Verification
                    </h1>
                </header>

                {/* Capture Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="relative w-full max-w-md">
                        {/* Guidance Text */}
                        <p className="text-white/80 text-center mb-8 text-sm">
                            Position your face within the oval
                        </p>

                        {/* Oval Frame */}
                        <div className="relative aspect-[3/4] w-full rounded-[50%] overflow-hidden border-2 border-white/30">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                            />
                        </div>

                        {/* Error Messages */}
                        {error && (
                            <p className="text-red-400 text-center mt-6 text-sm">
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                {/* Capture Button */}
                <div className="p-8 flex justify-center bg-black/50">
                    <button 
                        onClick={capturePhoto}
                        disabled={!!error || isCapturing}
                        className={`w-16 h-16 rounded-full border-4 ${
                            isCapturing ? 'bg-red-500 border-red-300' :
                            error ? 'bg-gray-500 border-gray-300' :
                            'bg-white border-white/50'
                        } transition-all`}
                    />
                </div>
            </div>
        </div>
    );
}
