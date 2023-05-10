import { User } from "./user";

export type Registration = Omit<User, "userId">;