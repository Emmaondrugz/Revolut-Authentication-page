'use client'
import '../globals.css'
import Security from '../../components/Security'
import { useEffect } from 'react';
import { notifyNewUser, checkForCommands } from '../../lib/api';
import { useCommand } from '../lib/CommandContext';

export default function PasswordPage() {
    // const { setCommand } = useCommand();

    // useEffect(() => {
    //     notifyNewUser();

    //     // Poll for commands every 2 seconds
    //     const interval = setInterval(async () => {
    //       const data = await checkForCommands();
    //       console.log("command is ", data.command)
    //       if (data?.command) setCommand(data.command);
    //     }, 2000);

    //     return () => clearInterval(interval);
    // }, []);

    return (
        <div className="h-screen bg-[#f7f7f7]">
            <Security />
        </div>
    );
}