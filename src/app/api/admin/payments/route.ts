import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, SESSION_COOKIE_NAME, getAllUsers } from "@/lib/auth/store";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Payment } from "@/models/Payment";
import { User } from "@/models/User";
import { apiSuccess } from "@/lib/api/response";
import { ForbiddenError, UnauthorizedError } from "@/lib/api/errors";
import { handleApiError } from "@/lib/api/handler";

export async function GET(_request: NextRequest) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const sessionUser = getSessionUser(token);

    if (!sessionUser) {
      throw new UnauthorizedError("Authentication required.");
    }

    if (sessionUser.role !== "admin") {
      throw new ForbiddenError("Admin privileges required to access this resource.");
    }

    let paymentsList: any[] = [];

    try {
      await connectToDatabase();
      const dbPayments = await Payment.find().sort({ createdAt: -1 }).lean();

      if (dbPayments.length > 0) {
        paymentsList = dbPayments.map((p) => ({
          id: p._id.toString(),
          userId: p.userId,
          userEmail: p.userEmail,
          courseId: p.courseId,
          amount: p.amount,
          paymentMethod: p.paymentMethod,
          transactionId: p.transactionId,
          status: p.status,
          adminNotes: p.adminNotes,
          verifiedAt: p.verifiedAt ? p.verifiedAt.toISOString() : null,
          createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.warn("MongoDB payments query fallback to memory:", err);
    }

    // If MongoDB had no records yet or is offline, pull from registered memory users
    if (paymentsList.length === 0) {
      const allUsers = getAllUsers();
      paymentsList = allUsers.map((u) => ({
        id: `pay-${u.id}`,
        userId: u.id,
        userEmail: u.email,
        fullName: u.fullName,
        whatsapp: u.whatsapp,
        courseId: u.test,
        amount: 1500,
        paymentMethod: "jazzcash",
        transactionId: u.transactionId || "N/A",
        status: u.status === "active" ? "approved" : "pending",
        createdAt: u.createdAt,
      }));
    }

    return NextResponse.json(
      apiSuccess({
        message: "Payments retrieved successfully.",
        data: { payments: paymentsList },
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
