import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, SESSION_COOKIE_NAME, updateUserStatus } from "@/lib/auth/store";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Payment } from "@/models/Payment";
import { User } from "@/models/User";
import { apiSuccess } from "@/lib/api/response";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/lib/api/errors";
import { handleApiError } from "@/lib/api/handler";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const sessionUser = getSessionUser(token);

    if (!sessionUser) {
      throw new UnauthorizedError("Authentication required.");
    }

    if (sessionUser.role !== "admin") {
      throw new ForbiddenError("Admin privileges required.");
    }

    const { paymentId } = await params;
    const body = await request.json();
    const action: "approve" | "reject" = body.action;
    const adminNotes: string = body.adminNotes || "";

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { success: false, message: "Invalid action. Must be 'approve' or 'reject'." },
        { status: 400 }
      );
    }

    const targetStatus = action === "approve" ? "approved" : "rejected";
    const targetUserStatus = action === "approve" ? "active" : "suspended";

    // 1. Try updating in MongoDB
    try {
      await connectToDatabase();
      const payment = await Payment.findById(paymentId);

      if (payment) {
        payment.status = targetStatus;
        payment.adminNotes = adminNotes;
        payment.verifiedAt = new Date();
        payment.verifiedBy = sessionUser.email;
        await payment.save();

        if (payment.userId) {
          await User.findByIdAndUpdate(payment.userId, {
            status: targetUserStatus,
          });
        }

        if (payment.userEmail) {
          updateUserStatus(payment.userEmail, targetUserStatus);
        }

        return NextResponse.json(
          apiSuccess({
            message: `Payment marked as ${targetStatus}. Student account is now ${targetUserStatus}.`,
          })
        );
      }
    } catch (err) {
      console.warn("MongoDB verify fallback:", err);
    }

    // 2. Fallback memory update if memory payment ID
    if (paymentId.startsWith("pay-")) {
      const email = body.userEmail;
      if (email) {
        updateUserStatus(email, targetUserStatus);
      }
      return NextResponse.json(
        apiSuccess({
          message: `Payment updated to ${targetStatus} (in-memory mode).`,
        })
      );
    }

    throw new NotFoundError("Payment record not found.");
  } catch (error) {
    return handleApiError(error);
  }
}
