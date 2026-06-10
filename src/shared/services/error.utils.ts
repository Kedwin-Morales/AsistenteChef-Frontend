export function getErrorMessage(error: unknown, fallback = "Error inesperado"): string {
  if (typeof error === "string") return error;
  const axiosError = error as Record<string, unknown>;
  const response = axiosError?.response as Record<string, unknown> | undefined;
  const data = response?.data as Record<string, unknown> | undefined;

  if (typeof data?.title === "string") return data.title;
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.map(String).join(", ");
  if (typeof data?.message === "string") return data.message;

  const message = axiosError?.message;
  if (typeof message === "string") return message;

  return fallback;
}
