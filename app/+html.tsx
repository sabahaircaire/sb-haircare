import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

// Custom HTML root for Expo Web — sets <html lang="fr"> so Chrome
// doesn't auto-translate French labels into garbled French.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#4A1015" />
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="fr" />
        <title>SB Haircare</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: bodyStyle }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const bodyStyle = `
body {
  background-color: #FFFFFF;
}
`;
