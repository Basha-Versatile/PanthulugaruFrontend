import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panthulu Garu - Find Trusted Pandits for Hindu Ceremonies",
  description:
    "Panthulu Garu connects devotees with verified and experienced pandits for all Hindu ceremonies, pujas, and rituals across India. Book pandits, photographers, and caterers for your religious events.",
  keywords: [
    "pandit",
    "hindu ceremonies",
    "puja booking",
    "rituals",
    "panthulugaru",
    "brahmin",
    "priest",
    "horoscope",
    "panchangam",
    "temple jobs",
    "death anniversary",
    "caterers",
    "photographers",
  ],
  openGraph: {
    title: "Panthulu Garu - Find Trusted Pandits",
    description: "Book verified pandits for Hindu ceremonies and rituals",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-[#121212] dark:text-gray-100 antialiased transition-colors duration-300">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#1a1a1a",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
              },
              success: {
                iconTheme: {
                  primary: "#E07B39",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#CC3333",
                  secondary: "#fff",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
