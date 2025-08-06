import { useEffect, useRef, useState } from "react";

interface CulqiInstance {
  open: () => void;
  close: () => void;
  token?: { id: string };
  error?: Error;
  culqi?: () => void;
}

declare global {
  interface Window {
    CulqiCheckout: new (publicKey: string, config: object) => CulqiInstance;
  }
}

/**
 * Custom hook to load Culqi Checkout script and return the CulqiCheckout constructor
 * @returns {Window["CulqiCheckout"] | null} CulqiCheckout constructor or null if not loaded
 */
export function useCulqiScript(): Window["CulqiCheckout"] | null {
  const [loaded, setLoaded] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (window.CulqiCheckout) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.culqi.com/checkout-js";
    script.async = true;
    scriptRef.current = script;
    script.onload = () => setLoaded(true);
    script.onerror = () => setLoaded(false);
    document.head.appendChild(script);
    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
    };
  }, []);

  return loaded ? window.CulqiCheckout ?? null : null;
}
