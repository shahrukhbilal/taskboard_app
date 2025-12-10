import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";

export async function GET() {
  try {
    await dbConnect();

    const employees = await User.find({ role: "employee" }).select("name email _id techRole");

    return Response.json({
  employees: employees || []
});

  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
