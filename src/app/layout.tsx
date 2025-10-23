import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import { ProfileProvider } from "@/context/ProfileContext";
import LoadingOverlay from "@/components/LoadingOverlay";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Abdullah Javed | Software Engineer & ML Enthusiast",
  description: "Dedicated software engineer passionate about solving real-world problems using modern technologies. Aspiring Machine Learning Engineer focused on building intelligent systems and AI-driven solutions.",
  keywords: [
    "Abdullah Javed",
    "Software Engineer",
    "Machine Learning Engineer",
    "AI Engineer",
    "Next.js Portfolio",
    "Three.js",
    "WebGL",
  ],
  openGraph: {
    title: "Abdullah Javed | Software Engineer & ML Enthusiast",
    description:
      "Software engineer crafting intelligent web experiences and machine learning prototypes.",
    url: "https://abdullah.dev",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/profile/hero-grid.jpg",
        width: 1200,
        height: 630,
        alt: "Abdullah Javed Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdullah Javed | Software Engineer & ML Enthusiast",
    description:
      "Exploring web engineering, Java applications, and applied machine learning.",
    creator: "@abdullah_codes",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden relative`}>
        <ProfileProvider>
          <LoadingOverlay />
          <Menu />
          {children}
          <Footer />
        </ProfileProvider>
      </body>
    </html>
  );
}
