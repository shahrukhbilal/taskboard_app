"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";

// Fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Detect if admin panel should be used
  const showAdminLayout = pathname.startsWith("/dashboard/admindashboard");

  // Sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect screen width
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setIsSidebarOpen(desktop); // open by default on desktop
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-close sidebar on mobile when changing pages
  useEffect(() => {
    if (!isDesktop) setIsSidebarOpen(true);
  }, [pathname, isDesktop]);

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>

      <body
        className={`bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 ${geistSans.variable} ${geistMono.variable}`}
      >
        <Toaster richColors position="top-right" />

        {/* ADMIN LAYOUT */}
        {showAdminLayout && (
          <>
            <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          </>
        )}

        {/* MAIN CONTENT */}
        <main
          className={`pt-16 transition-all duration-300 p-6 ${
            showAdminLayout && isDesktop && isSidebarOpen ? "lg:pl-[250px]" : "lg:pl-0"
          }`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
