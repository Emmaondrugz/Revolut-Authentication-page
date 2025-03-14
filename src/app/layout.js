"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./lib/ThemeContext";
import { EmailProvider } from "./lib/EmailContext";
import { notifyNewUser, checkForCommands } from '../lib/api';
import { CommandProvider } from './lib/CommandContext';
import CommandPoller from '../components/CommanderPoller';
import { ChakraProvider} from '@chakra-ui/react';
import { system } from "@chakra-ui/react/preset";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#f7f7f7] antialiased`}>
        <ChakraProvider value={system}>
          <EmailProvider>  {/* Ensure EmailProvider wraps everything */}
            <CommandProvider>
                    <CommandPoller />
                    <ThemeProvider>{children}</ThemeProvider>
            </CommandProvider>
          </EmailProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
