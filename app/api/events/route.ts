import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json(); // ← جاهز

    const createdEvent = await Event.create(data);
    return NextResponse.json(
      { message: "Event created successfully.", event: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Could not create event.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ date: -1 });
    return NextResponse.json(
      { message: "Events fetched successfully.", events },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Could not fetch events.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
