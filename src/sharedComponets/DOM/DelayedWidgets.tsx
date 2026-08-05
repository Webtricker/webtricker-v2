"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/ui/ChatWidget"), { ssr: false });
const WhatsAppChat = dynamic(() => import("@/sharedComponets/DOM/WhatsAppChat"), { ssr: false });

export default function DelayedWidgets() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Wait for idle time or 3.5 seconds to load non-critical widgets
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 3500);

    const handleInteraction = () => {
      setShouldLoad(true);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("scroll", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <>
      <ChatWidget />
      <WhatsAppChat />
    </>
  );
}
