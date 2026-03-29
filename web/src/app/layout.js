import { JetBrains_Mono, Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: "CodeAssess - Practice Workspace and Secure Coding Exams",
    template: "%s | CodeAssess",
  },
  description:
    "Client-side coding practice and secure browser-based exam workflows with Pyodide, persistent session recovery, and a shared exam timer.",
  keywords: ["coding", "practice", "online judge", "programming", "assessment", "exam"],
  appleWebApp: {
    title: "CodeAssess",
  },
  openGraph: {
    title: "CodeAssess - Practice Workspace and Secure Coding Exams",
    description:
      "Client-side coding practice and secure browser-based exam workflows with Pyodide, persistent session recovery, and a shared exam timer.",
    type: "website",
    locale: "en_US",
    siteName: "CodeAssess",
    images: [
      {
        url: "/api/og?title=Practice freely. Run exams seriously.&subtitle=Client-side coding practice and secure browser-based exam workflows&category=Coding Assessment Platform&accentColor=%234d7cff",
        width: 1200,
        height: 630,
        alt: "CodeAssess - Practice Workspace and Secure Coding Exams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeAssess - Practice Workspace and Secure Coding Exams",
    description:
      "Client-side coding practice and secure browser-based exam workflows with Pyodide, persistent session recovery, and a shared exam timer.",
    images: [
      "/api/og?title=Practice freely. Run exams seriously.&subtitle=Client-side coding practice and secure browser-based exam workflows&category=Coding Assessment Platform&accentColor=%234d7cff",
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
