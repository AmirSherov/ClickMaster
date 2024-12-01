export const metadata = {
  title: "Click Master",
  description: "Game of Clicking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
