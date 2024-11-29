"use client";

import { useEffect, useState } from "react";
import PageTransitionLoader from "./PageTransitionLoader";

export default function LoadingIndicator() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    window.addEventListener("navigationStart", startLoading);
    window.addEventListener("navigationEnd", stopLoading);

    // Cleanup
    return () => {
      window.removeEventListener("navigationStart", startLoading);
      window.removeEventListener("navigationEnd", stopLoading);
    };
  }, []);

  if (!loading) return null;

  return <PageTransitionLoader />;
}
