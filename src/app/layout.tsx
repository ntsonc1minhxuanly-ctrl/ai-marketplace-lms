import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/Providers";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["vietnamese", "latin"] });

export const metadata: Metadata = {
  title: "Antigravity AI - Marketplace Công cụ AI, Khóa học Automations & Tài liệu số",
  description: "Khám phá chợ ứng dụng AI, tài khoản Premium ChatGPT/Midjourney, khóa học lập trình Workflow Automation n8n, mẫu Prompt và eBook công nghệ hàng đầu Việt Nam.",
  metadataBase: new URL("https://antigravity.vn"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Antigravity AI - SaaS Marketplace, LMS & Membership Platform",
    description: "Nền tảng thương mại điện tử công cụ AI, khóa học công nghệ tự động hóa chất lượng cao.",
    url: "https://antigravity.vn",
    siteName: "Antigravity AI",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Antigravity AI Platform",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Antigravity AI Marketplace & LMS",
    description: "Mua bán công cụ AI, khóa học công nghệ, tự động hóa phễu và workflow.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full scroll-smooth">
      <body className={`${inter.className} min-h-full bg-slate-950 text-slate-100 antialiased`}>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
