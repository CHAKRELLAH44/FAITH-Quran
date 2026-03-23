import './globals.css'

export const metadata = {
  title: 'NŪR — Plateforme Coran Interactive',
  description: '114 sourates du Saint Coran — Lecture, Compréhension & Suivi',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NŪR',
  },
}

export const viewport = {
  themeColor: '#c9a84c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#c9a84c" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NŪR" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(reg) { console.log('NUR SW:', reg.scope); })
                  .catch(function(err) { console.warn('SW err:', err); });
              });
            }
          `
        }} />
      </body>
    </html>
  )
}