import { User } from "./User";

export type Comment = {
  id: number;
  created_at: string;
  user: User;
  body: string;
};
