"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { initGA, logPageView } from '../lib/analytics';
import { useEffect } from 'react';

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {
  useEffect(() => {
    initGA();
    logPageView();
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}