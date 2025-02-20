export interface ApiError {
  error: {
    message: string;
    code: string;
  };
}

export function isApiError(data: any): data is ApiError {
  return (
    "error" in data && typeof data.error === "object" && "message" in data.error
  );
}
