"use client";

import React, { useEffect, useState } from "react";

function NavInnerWrapper({ children = <></> }: { children?: React.ReactNode }) {
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 150) {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    // return window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`w-full flex items-center justify-center gap-4`}>
      {children}
    </div>
  );
}

export default NavInnerWrapper;
