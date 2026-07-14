import { ToastProvider } from "@/lib/ui/toast/ToastContext";
import "./globals.css"
import Providers from "./Provider";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>

        <Providers>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}