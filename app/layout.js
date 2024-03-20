import { Inter } from "next/font/google";
import "./globals.css";



const inter = Inter({ subsets: ["latin"] });


 

export const metadata = {
  title: "Générateur de CV par GEDS",
  description: "Application gratuite pour créer un CV en ligne",
};

export default function Root({ children }) {
  return (
    <html lang="fr">
      <body>

        {children}
        </body>
    </html>
  )
}