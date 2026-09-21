import type { Metadata } from "next";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME || "Onkar.K";
const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@iOnkar_K";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AudioFlow — Real-Time Transcription & Voice Studio",
    template: "%s | AudioFlow",
  },
  description: `AudioFlow is a fast voice toolkit featuring real-time speech-to-text transcription and studio-quality text-to-speech rendering. Built by ${authorName}.`,
  authors: [{ name: authorName, url: siteUrl }],
  creator: authorName,
  openGraph: {
    title: "AudioFlow — Speech to Text & TTS Studio",
    description: `Live speech transcription and studio text-to-speech rendering. Designed & built by ${authorName}.`,
    url: siteUrl,
    siteName: `AudioFlow by ${authorName}`,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "AudioFlow App Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AudioFlow — Speech to Text & TTS Studio",
    description: `Live speech transcription and studio text-to-speech rendering. Built by ${authorName}.`,
    creator: twitterHandle,
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${geistMono.variable} min-h-full flex flex-col h-full antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
