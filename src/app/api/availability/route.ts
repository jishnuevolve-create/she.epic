import { getAvailability, getMonthAvailability } from "@/features/booking/server/service";
import { errorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/security";
export async function GET(request: Request) {
  try {
    await rateLimit(request, "availability", 90);
    const params = new URL(request.url).searchParams;
    const month = params.get("month");
    return Response.json(
      month ? await getMonthAvailability(month) : await getAvailability(params.get("date") || ""),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
