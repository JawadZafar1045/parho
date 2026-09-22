import mongoose from "mongoose";
import { getEnv } from "@/config";

const MONGOOSE_READY_STATE = 1;

type GlobalWithMongoose = typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose>;
};

const globalWithMongoose = globalThis as GlobalWithMongoose;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === MONGOOSE_READY_STATE) {
    return mongoose;
  }

  if (!globalWithMongoose.mongooseConnection) {
    const { MONGODB_URI } = getEnv();

    globalWithMongoose.mongooseConnection = mongoose
      .connect(MONGODB_URI)
      .catch((error) => {
        globalWithMongoose.mongooseConnection = undefined;
        throw error;
      });
  }

  await globalWithMongoose.mongooseConnection;
  return mongoose;
}
