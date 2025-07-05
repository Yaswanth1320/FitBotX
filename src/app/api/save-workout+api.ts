import { adminClient } from "utils/client";

export async function POST(request: Request) {
  const { workoutData }: { workoutData: any } = await request.json();

  try {
    // Debug: log the incoming workoutData
    console.log("Received workoutData:", workoutData);

    // Validate required fields
    if (
      !workoutData.userId ||
      !workoutData.date ||
      !workoutData.duration ||
      !Array.isArray(workoutData.sets)
    ) {
      return Response.json(
        { error: "Missing required workout fields" },
        { status: 400 }
      );
    }

    // Save to Sanity using admin client
    const result = await adminClient.create(workoutData);

    return Response.json({
      success: true,
      workoutId: result._id,
      message: "Workout saved successfully",
    });
  } catch (error) {
    console.error("Error saving workout:", error);
    return Response.json({ error: "Failed to save workout" }, { status: 500 });
  }
}
