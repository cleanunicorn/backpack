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

export const metadata: Metadata = {
  title: "Backpack",
  description: "Backpack is a platform for creating and sharing your link collection.",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Backpack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('ServiceWorker registration successful');
                      
                      // Check for updates on page load
                      registration.addEventListener('updatefound', function() {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', function() {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('New version available, reloading...');
                            window.location.reload();
                          }
                        });
                      });
                      
                      // Check for updates immediately
                      registration.update();
                    })
                    .catch(function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                });
                
                // Listen for service worker controlling the page
                navigator.serviceWorker.addEventListener('controllerchange', function() {
                  window.location.reload();
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
