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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FDF8F0] dark:bg-[#0D0907] text-[#361E1E] dark:text-[#E8DDD0] antialiased transition-colors duration-300">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#FDF8F0",
                color: "#361E1E",
                borderRadius: "12px",
                border: "1px solid rgba(212, 175, 55, 0.15)",
                boxShadow: "0 8px 24px rgba(54, 30, 30, 0.08)",
                fontSize: "14px",
                fontFamily: "Inter, system-ui, sans-serif",
              },
              success: {
                iconTheme: {
                  primary: "#D4AF37",
                  secondary: "#FDF8F0",
                },
              },
              error: {
                iconTheme: {
                  primary: "#CC3333",
                  secondary: "#FDF8F0",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
