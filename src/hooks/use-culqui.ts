import { useEffect, useRef, useState } from "react";

export type CulqiChargeError = {
  object: "error";
  type: string;
  charge_id: string;
  code: string;
  decline_code: string | null;
  merchant_message: string;
  user_message: string;
};

export interface CulqiInstance {
  open: () => void;
  close: () => void;
  token?: { id: string };
  error?: Error;
  culqi?: () => void;
}

export type CulqiConstructorType = new (
  publicKey: string,
  config: object
) => CulqiInstance;

declare global {
  interface Window {
    CulqiCheckout?: CulqiConstructorType;
  }
}

// Return type explicitly includes the constructor function
export function useCulqi() {
  const [CulqiCheckout, setCulqiCheckout] =
    useState<CulqiConstructorType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (window.CulqiCheckout) {
      setCulqiCheckout(() => window.CulqiCheckout!);
      return;
    }

    setLoading(true);
    const script = document.createElement("script");
    script.src = "https://js.culqi.com/checkout-js";
    script.async = true;
    scriptRef.current = script;

    script.onload = () => {
      if (window.CulqiCheckout) {
        setCulqiCheckout(() => window.CulqiCheckout!);
      } else {
        setError(
          new Error("Culqi script loaded but CulqiCheckout object not found")
        );
      }
      setLoading(false);
    };

    script.onerror = () => {
      setError(new Error("Failed to load CulqiCheckout script"));
      setLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
    };
  }, []);

  return { CulqiCheckout, loading, error };
}
