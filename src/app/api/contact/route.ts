import { contactSchema } from "@/features/contact/schema";
import { database } from "@/lib/supabase/server";
import { AppError, errorResponse } from "@/lib/errors";
import { assertOrigin, rateLimit, readBody } from "@/lib/security";
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    await rateLimit(request, "contact");
    const parsed = contactSchema.safeParse(await readBody(request));
    if (!parsed.success) throw new AppError("Please check your name, email and message.", 422);
    const { requestId, name, email, message } = parsed.data;
    const { error } = await database()
      .from("contact_enquiries")
      .upsert(
        { request_id: requestId, name, email, message },
        { onConflict: "request_id", ignoreDuplicates: true },
      );
    if (error) throw new AppError("Your message could not be saved. Please try again.", 503);
    return Response.json(
      { message: "Your message has been received by the studio." },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
