// Google AI configuration for browser environment
export const getGoogleApiKey = (): string => {
  // En el navegador, solo podemos usar import.meta.env con variables VITE_
  const apiKey =
    import.meta.env.VITE_GOOGLE_API_KEY ||
    "AIzaSyDWe2tTi2D6bx9VeWdJlczI99z_ipWP9b4"; // Fallback

  if (!apiKey) {
    throw new Error("VITE_GOOGLE_API_KEY not found in environment");
  }

  return apiKey;
};
