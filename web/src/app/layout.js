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
  title: "CodeAssess - Practice Workspace and Secure Coding Exams",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeAssess - Practice Workspace and Secure Coding Exams",
    description:
      "Client-side coding practice and secure browser-based exam workflows with Pyodide, persistent session recovery, and a shared exam timer.",
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
