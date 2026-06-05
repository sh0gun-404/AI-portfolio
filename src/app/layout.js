import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shubh Shaguneet Singh | AI Portfolio & Copilot",
  description: "Professional developer portfolio of Shubh Shaguneet Singh, Computer Science student at BITS Pilani Goa Campus. Ask our AI Copilot about Shubh's projects, experience, education, and credentials.",
  keywords: ["Shubh Shaguneet Singh", "BITS Pilani", "Computer Science", "Software Engineer", "AI Copilot", "Developer Portfolio", "GNSS Software", "Flutter", "MySQL"],
  authors: [{ name: "Shubh Shaguneet Singh" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
