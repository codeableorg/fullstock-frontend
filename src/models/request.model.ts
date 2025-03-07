export type RequestConfig = Omit<RequestInit, "body"> & {
  body?: unknown;
};
