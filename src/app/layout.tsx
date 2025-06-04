import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/BottomNavigationBar"

export const metadata: Metadata = {
  title: "DaLart-app",
  description: "DaLart",
};


export default function RootLayout() {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body className="font-sans antialiased">
        
        <div>hello</div>
        <Footer/>
      </body>
    </html>
  );
}
