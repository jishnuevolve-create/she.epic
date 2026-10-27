export class AppError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function errorResponse(error: unknown) {
  if (error instanceof AppError)
    return Response.json({ error: error.message }, { status: error.status });
  console.error("Request failed", { kind: error instanceof Error ? error.name : "Unknown" });
  return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}
