"use client";

import Script from "next/script";

export function TweakcnLivePreview() {
  return (
    <Script
      async
      crossOrigin="anonymous"
      src="https://tweakcn.com/live-preview.min.js"
      strategy="afterInteractive"
    />
  );
}
