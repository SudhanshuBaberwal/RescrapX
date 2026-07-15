import { ToastProvider } from "@/lib/ui/toast/ToastContext";
import "./globals.css"
import { GoogleOAuthProvider } from "@react-oauth/google";
import StoreProvider from "@/store/StoreProvider";
import InitUser from "@/InitUser";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <StoreProvider>
            <InitUser />
            <ToastProvider>
              {children}
            </ToastProvider>
          </StoreProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}