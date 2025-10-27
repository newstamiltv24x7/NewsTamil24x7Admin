import NoSsr from "@/utils/NoSsr";
import "@/index.scss";
import MainProvider from "./MainProvider";
import { ThemeProvider } from "@mui/material";
import theme from "./customiseTheme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link
          rel="icon"
          href="/assets/images/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="shortcut icon"
          href="/assets/images/favicon.ico"
          type="image/x-icon"
        />
        <title>News Tamil 24x7</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800&amp;display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/@icon/icofont/icofont.css"
        ></link>
        <script async src="https://platform.twitter.com/widgets.js"  charSet="utf-8"></script>
        <script async src="https://www.instagram.com/embed.js"  charSet="utf-8"></script>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
          async
          defer
        ></script>
        {/* <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAjeJEPREBQFvAIqDSZliF0WjQrCld-Mh0"></script> */}
      </head>
      <body suppressHydrationWarning={true}>
        <ThemeProvider theme={theme}>
          <NoSsr>
            <MainProvider>{children}</MainProvider>
          </NoSsr>
        </ThemeProvider>
      </body>
    </html>
  );
}
