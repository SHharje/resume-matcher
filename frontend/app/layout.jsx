import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Resume Matcher",
  description:
    "Upload your resume and discover which jobs match your skills. AI-powered skill gap analysis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-zinc-900 font-sans text-zinc-100">
        {/* Navigation bar */}
        <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
            <a href="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-black shadow-md shadow-indigo-500/30">
                RM
              </span>
              Resume Matcher
            </a>
          </div>
        </nav>

        {/* Page content */}
        {children}
      </body>
    </html>
  );
}
