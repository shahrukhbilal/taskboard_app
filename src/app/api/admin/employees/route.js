import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";

// GET request handler
// -------------------
// Is API ka kaam sirf employees ki list return karna hai
// jinka role "employee" hai (admins ko intentionally exclude kiya gaya hai)

export async function GET() {
  try {
    // 🔌 Make sure database connection is established
    await dbConnect();

    // 📋 Fetch all users with role = "employee"
    // Sirf required fields select ki ja rahi hain for performance & security
    const employees = await User
      .find({ role: "employee" })
      .select("name email _id techRole");

    // ✅ Return employees list (fallback empty array to avoid frontend crashes)
    return Response.json({
      employees: employees || []
    });

  } catch (error) {
    // ❌ Log actual error for debugging
    console.log(error);

    // 🚨 Generic error response for client
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
