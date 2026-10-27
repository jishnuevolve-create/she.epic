import { after } from "next/server";
import { createAppointment } from "@/features/booking/server/service";
import { sendNotification } from "@/lib/email/notifications";
import { errorResponse } from "@/lib/errors";
import { assertOrigin, rateLimit, readBody } from "@/lib/security";
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    await rateLimit(request, "booking");
    const id = await createAppointment(await readBody(request));
    after(() => sendNotification(id));
    return Response.json(
      {
        message:
          "Your consultation request has been received. We'll contact you to confirm your appointment.",
      },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
