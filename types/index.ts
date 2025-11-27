import { ObjectId } from "mongodb";

export interface EventItem {
  _id: string | ObjectId;
  title: string;
  slug: string;
  image: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  overview: string;
  description: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
