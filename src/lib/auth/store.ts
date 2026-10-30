import crypto from "node:crypto";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User, type UserRole, type UserStatus } from "@/models/User";
import { Payment } from "@/models/Payment";

export const SESSION_COOKIE_NAME = "parho_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): string {
  if (process.env.AUTH_SESSION_SECRET) {
    return process.env.AUTH_SESSION_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SESSION_SECRET must be configured in production.");
  }

  return "parho-development-session-secret-key-2026";
}

export type UserRecord = {
  id: string;
  test: string;
  fullName: string;
  education?: string;
  whatsapp: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  transactionId?: string;
  role: UserRole;
  status: UserStatus;
  enrolledCourses: string[];
  createdAt: string;
};

const users = new Map<string, UserRecord>();

// Default Seed Admin Account
users.set("jawad@gmail.com", {
  id: "seed-jawad",
  test: "ppsc",
  fullName: "Jawad",
  education: "Admin",
  whatsapp: "03000000000",
  email: "jawad@gmail.com",
  passwordHash:
    "762be33b11535a3cd1e2e06009f0ed5cc3473321bb08d0fb31681871b161cd04c30eec55094909981209ffd9264aa18c16dfbe45c8ada7364e0ef6c7ffe01b3c",
  passwordSalt: "4f5f8c2a9d7e1b6c3a8f0d2e5b7c9a1f",
  transactionId: "SEED-ADMIN",
  role: "admin",
  status: "active",
  enrolledCourses: ["ppsc", "fpsc", "nts", "css", "pms"],
  createdAt: "2026-09-24T00:00:00.000Z",
});

export type SignupInput = {
  test: string;
  fullName: string;
  education?: string;
  whatsapp: string;
  email: string;
  password: string;
  confirmPassword?: string;
  transactionId: string;
};

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Creates user and records payment transaction.
 * Saves to memory immediately and synchronizes with MongoDB if available.
 */
export function createUser(data: SignupInput): UserRecord {
  const email = normalizeEmail(data.email);

  if (users.has(email)) {
    const error = new Error("An account with this email already exists.");
    throw Object.assign(error, { statusCode: 409, code: "USER_EXISTS" });
  }

  const passwordSalt = crypto.randomBytes(16).toString("hex");
  const enrolledCourse = data.test.trim().toLowerCase() || "ppsc";

  const user: UserRecord = {
    id: crypto.randomUUID(),
    test: data.test.trim(),
    fullName: data.fullName.trim(),
    education: data.education?.trim() || undefined,
    whatsapp: data.whatsapp.trim(),
    email,
    passwordHash: hashPassword(data.password, passwordSalt),
    passwordSalt,
    transactionId: data.transactionId.trim(),
    role: "student",
    status: "pending_verification",
    enrolledCourses: [enrolledCourse],
    createdAt: new Date().toISOString(),
  };

  users.set(email, user);

  // Asynchronously persist to MongoDB
  syncUserToMongo(user, data.transactionId).catch((err) => {
    console.warn("MongoDB sync failed (running in memory mode):", err.message);
  });

  return user;
}

async function syncUserToMongo(userRecord: UserRecord, transactionId: string) {
  try {
    await connectToDatabase();
    const existing = await User.findOne({ email: userRecord.email });
    if (!existing) {
      const createdUser = await User.create({
        fullName: userRecord.fullName,
        email: userRecord.email,
        whatsapp: userRecord.whatsapp,
        education: userRecord.education,
        test: userRecord.test,
        passwordHash: userRecord.passwordHash,
        passwordSalt: userRecord.passwordSalt,
        role: userRecord.role,
        status: userRecord.status,
        enrolledCourses: userRecord.enrolledCourses,
      });

      // Record pending payment
      if (transactionId) {
        await Payment.create({
          userId: createdUser._id.toString(),
          userEmail: userRecord.email,
          courseId: userRecord.test,
          amount: 1500,
          paymentMethod: "jazzcash",
          transactionId,
          status: "pending",
        });
      }
    }
  } catch (err) {
    console.warn("Could not sync user to MongoDB:", err);
  }
}

export function publicUser(user: UserRecord) {
  const { passwordHash, passwordSalt, ...safeUser } = user;
  void passwordHash;
  void passwordSalt;
  return safeUser;
}

export function verifyLogin(email: string, password: string): UserRecord | null {
  const normalizedEmail = normalizeEmail(email);
  const user = users.get(normalizedEmail);

  if (!user) {
    return null;
  }

  const candidateHash = hashPassword(password, user.passwordSalt);

  try {
    const expected = Buffer.from(user.passwordHash, "hex");
    const actual = Buffer.from(candidateHash, "hex");

    if (expected.length !== actual.length) {
      return null;
    }

    return crypto.timingSafeEqual(expected, actual) ? user : null;
  } catch {
    return null;
  }
}

export function createSession(email: string, role: UserRole = "student"): string {
  const payload = JSON.stringify({
    email: normalizeEmail(email),
    role,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = crypto.createHmac("sha256", getSessionSecret()).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function getSessionUser(token?: string): ReturnType<typeof publicUser> | null {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = crypto.createHmac("sha256", getSessionSecret()).update(encodedPayload).digest("base64url");
  const expected = Buffer.from(expectedSignature);
  const actual = Buffer.from(signature);

  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    return null;
  }

  let session: { email: string; role?: UserRole; expiresAt: number };
  try {
    session = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as typeof session;
  } catch {
    return null;
  }

  if (!session.email || session.expiresAt < Date.now()) {
    return null;
  }

  const user = users.get(session.email);
  return user ? publicUser(user) : null;
}

export function getAllUsers(): UserRecord[] {
  return Array.from(users.values());
}

export function updateUserStatus(email: string, status: UserStatus): boolean {
  const normalized = normalizeEmail(email);
  const user = users.get(normalized);
  if (user) {
    user.status = status;
    return true;
  }
  return false;
}
