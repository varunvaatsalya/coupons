import dbConnect from "@/lib/Mongodb";
import Users from "@/models/Users";

export async function getSections() {
  await dbConnect();
  return Users.find().sort({ _id: 1 }).lean();
}
