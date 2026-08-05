import NoSsr from "@/utils/NoSsr";
import "@/index.scss";
import MainProvider from "./MainProvider";
import { ThemeProvider } from "@mui/material";
import theme from "./customiseTheme";
import { montserrat } from "./fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={montserrat.className}>
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
        <link
          rel="stylesheet"
          href="https://unpkg.com/@icon/icofont/icofont.css"
        ></link>
        <script async src="https://platform.twitter.com/widgets.js"  charSet="utf-8"></script>
        <script async src="https://www.instagram.com/embed.js"  charSet="utf-8"></script>
        <script async type="application/javascript" src="https://news.google.com/swg/js/v1/swg-basic.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `(self.SWG_BASIC = self.SWG_BASIC || []).push( basicSubscriptions => {
    basicSubscriptions.init({
      type: "NewsArticle",
      isPartOfType: ["Product"],
      isPartOfProductId: "CAow2NTDDA:openaccess",
      clientOptions: { theme: "light", lang: "ta" },
    });
  });`,
          }}
        ></script>
        {/* Google Maps loaded conditionally only on pages that use it */}
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
