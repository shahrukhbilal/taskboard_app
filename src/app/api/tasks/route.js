import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/model/Task";
import mongoose from "mongoose";

//Get route to get data from DB and send that data to frontend 
export async function GET() {
  try {
    await dbConnect();
    // Task.find() retrieves all documents stored in the Task collection.
    // and .lean() function removes all unnessory functions from mongoose document and  converts the data into normal javaScript object 
    const tasks = await Task.find().lean();

    // this block is used to count stats 
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;
    const pending = tasks.filter(t => t.status === "todo").length;


//“How many tasks are due within the next 7 days?”
  const upcomingDeadlines = tasks.filter(task => {
  const dueDate = new Date(task.due);

  // creates a new date object from current date and time 
  const today = new Date();

  const msInDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil((dueDate - today) / msInDay);

  return diffDays >= 0 && diffDays <= 7;
}).length;


    const weekly = [
      { name: "Mon", tasks: 8 },
      { name: "Tue", tasks: 9 },
      { name: "Wed", tasks: 7 },
      { name: "Thu", tasks: 14 },
      { name: "Fri", tasks: 10 },
      { name: "Sat", tasks: 12 },
      { name: "Sun", tasks: 8 },
    ];

    return NextResponse.json({
      tasks,
      stats: { total, completed, pending, inProgress, upcomingDeadlines },
      weekly
    });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

//  POST route for creating tasks
export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.json(); // frontend se JSON data


    const {title,
        description,
        priority,
        assignedTo,
        status,
        due, } = data;

    // Validate required fields
   if (!title || !description || !priority || !assignedTo || !status || !due) {
  return NextResponse.json({ error: "Missing fields" }, { status: 400 });
}
// Convert assignedTo into ObjectId
    const assignedToObjectId = new mongoose.Types.ObjectId(assignedTo);

    // Create new task in MongoDB
    const task = await Task.create({title,
        description,
        priority,
        assignedTo: assignedToObjectId,
        status,
        due, });
    console.log(" Task Data:", task);
    return NextResponse.json(task, { status: 201 });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}