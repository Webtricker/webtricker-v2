"use client"

import React, { useEffect } from 'react';

const LiveChat = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/6623d49f1ec1082f04e50913/1hrtvd4ct';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://embed.tawk.to"></link>
    </>
  );
};

export default LiveChat;