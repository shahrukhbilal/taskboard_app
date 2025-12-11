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

  // Auto-close sidebar when switching pages (mobile fix)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

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

            <Sidebar isOpen={isSidebarOpen} />
          </>
        )}

        {/* MAIN CONTENT */}
        <main
          className={
            showAdminLayout
              ? `
                pt-16 
                transition-all duration-300
                ${isSidebarOpen ? "lg:pl-[250px]" : "lg:pl-[250px]"}
                p-6
              `
              : "p-0"
          }
        >
          {children}
        </main>
      </body>
    </html>
  );
}
