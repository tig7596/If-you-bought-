export const metadata = {
  title: "If You Bought",
  description: "Crypto time machine for missed gains",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
