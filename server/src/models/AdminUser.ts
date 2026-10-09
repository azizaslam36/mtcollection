import { Schema, model, models, type Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface AdminUserDocument extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const adminUserSchema = new Schema<AdminUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, trim: true },
  },
  { timestamps: true }
);

adminUserSchema.index({ email: 1 }, { unique: true });

adminUserSchema.methods.comparePassword = function (
  this: AdminUserDocument,
  candidate: string
) {
  return bcrypt.compare(candidate, this.passwordHash);
};

// Never serialize the hash if a document is accidentally sent as JSON.
adminUserSchema.set("toJSON", {
  transform: (_doc: AdminUserDocument, ret: Record<string, unknown>) => {
    delete ret.passwordHash;
    return ret;
  },
});

export const AdminUser =
  models.AdminUser || model<AdminUserDocument>("AdminUser", adminUserSchema);
