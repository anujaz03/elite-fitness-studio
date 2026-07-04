import type { Metadata } from "next";
import { Cinzel, Poppins, Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "../context/QueryProvider";
import { AuthProvider } from "../context/AuthContext";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EliteFit Studio | Premium Boutique Fitness Studio",
  description: "Experience luxury boutique fitness at EliteFit Studio. Discover fitness programs, explore professional trainers, book classes online, and manage memberships seamlessly.",
  keywords: ["Fitness Studio", "Boutique Gym", "HIIT", "Yoga", "Pilates", "Personal Training", "EliteFit"],
  authors: [{ name: "EliteFit Team" }],
  openGraph: {
    title: "EliteFit Studio | Premium Boutique Fitness Studio",
    description: "Experience luxury boutique fitness at EliteFit Studio. Discover fitness programs, explore professional trainers, book classes online, and manage memberships seamlessly.",
    url: "https://elitefitstudio.com",
    siteName: "EliteFit Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EliteFit Studio | Premium Boutique Fitness Studio",
    description: "Experience luxury boutique fitness at EliteFit Studio. Discover fitness programs, explore professional trainers, book classes online, and manage memberships seamlessly.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-charcoal text-brand-ivory selection:bg-brand-gold selection:text-brand-charcoal">
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
