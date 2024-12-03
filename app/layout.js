export const metadata = {
  title: "Click Master",
  description: "Game of Clicking",
};
import { GlobalProvider } from "./GlobalState";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.webp" sizes="any" />
        <link rel="icon" href="/logo.webp" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
