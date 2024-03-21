import { AuthContextProvider } from "@/context/AuthContext";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import Navbar from "../component/navbar";
import "./globals.css";
import AppAppBar from "../components/AppAppBar";
import Divider from "@mui/material/Divider";
import Footer from "../components/Footer";

// Load the Inter font with 'latin' subset
const inter = Inter({ subsets: ["latin"] });

// Metadata for the application
export const metadata = {
  title: "Boosted Link",
  description: "Boosted Link Websites",
};

// Root layout component for the application
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      {/*
        The <head /> component will contain the components returned by the nearest parent
        head.js. It can be used to define the document head for SEO, metadata, and other purposes.
        Learn more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {/* Wrap the children with the AuthContextProvider to provide authentication context */}
        <AuthContextProvider>
          {/* <Navbar /> */}
          <AppAppBar mode={"light"} />
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
          <Divider />
          <Footer />
        </AuthContextProvider>
      </body>
    </html>
  );
}
