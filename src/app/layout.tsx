import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';
// import '@asseinfo/react-kanban/dist/styles.css';
// import '/public/styles/Plugins.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body id={'root'} suppressHydrationWarning={true}>
        <AppWrappers>{children}</AppWrappers>
      </body>
    </html>
  );
}
