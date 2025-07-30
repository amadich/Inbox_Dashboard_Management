import ClientProvider from "@/components/ClientProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserInfo from "@/components/authUsers/UserInfo";
import AuthWrapper from "@/components/authUsers/AuthWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "لوحة التحكم - داخل الصندوق (Inbox Dashboard)",
  description: " لوحة التحكم الخاصة بتطبيق Inbox ",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider>
          
          <AuthWrapper>
              <UserInfo children={children}></UserInfo>
          </AuthWrapper>
            
        </ClientProvider>
        
      </body>
    </html>
  );
}
