export interface AuthSession {
  userId: string;
  expiresAt: Date;
}

export type SignupStatus = "PENDING" | "ACTIVE" | "PAYMENT_REJECTED";

export type SignupFormData = {
  test: string;
  fullName: string;
  education?: string;
  whatsapp: string;
  email: string;
  password: string;
  confirmPassword: string;
  transactionId: string;
};
