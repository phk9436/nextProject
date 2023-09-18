import React from "react";

interface Iprops {
  children: React.PropsWithChildren;
}

function Layout({ children }: Iprops) {
  return <>{children}</>;
}

export default Layout;
