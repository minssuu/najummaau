import type { Metadata } from "next";
import "./globals.css";
import AudioController from "./components/AudioController";
import PageMotion from "./components/PageMotion";

export const metadata: Metadata = {
  title: "회는 산 채로 뜬다 | 2026 인천",
  description: "명월파와 흑조파, 인천항과 국제 유통권을 두고 맞붙는 조폭 느와르 GL 스토리.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <PageMotion>{children}</PageMotion>
        <AudioController />
      </body>
    </html>
  );
}
