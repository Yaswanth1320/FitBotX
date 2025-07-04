import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { exerciseName } = await request.json();

  if (!exerciseName) {
    return Response.json(
      { error: "Exercise name is required" },
      { status: 404 }
    );
  }

  const prompt = `
You are a fitness coach.
You are given an exercise, provide clear instructions on how to perform the exercise. Include if any equipment is required. Explain the exercise in detail and for a beginner.

The exercise name is: ${exerciseName}

Keep it short and concise. Use markdown formatting.

Use the following format:

# Equipment Required

# Instructions

## Tips

## Variations

## Safety

keep spacing between the headings and the content.

Always use headings and subheadings.
`;
  try {
    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: prompt,
    });
    return Response.json({ message: response.output_text });
  } catch (error) {
    console.log("Error fetching ai data 111", error);
    return Response.json(
      {
        error: "Error fetching ai data",
      },
      { status: 500 }
    );
  }
}

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI("");

// export async function POST(request: Request) {
//   const { exerciseName } = await request.json();

//   if (!exerciseName) {
//     return Response.json(
//       { error: "Exercise name is required" },
//       { status: 404 }
//     );
//   }

//   const prompt = `
// You are a fitness coach.
// You are given an exercise, provide clear instructions on how to perform the exercise. Include if any equipment is required. Explain the exercise in detail and for a beginner.

// The exercise name is: ${exerciseName}

// Keep it short and concise. Use markdown formatting.

// Use the following format:

// # Equipment Required

// # Instructions

// ## Tips

// ## Variations

// ## Safety

// keep spacing between the headings and the content.

// Always use headings and subheadings.
// `;

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     return Response.json({ message: text });
//   } catch (error) {
//     console.error("Error fetching ai data from Gemini:", error);
//     return Response.json(
//       { error: "Error fetching ai data from Gemini" },
//       { status: 500 }
//     );
//   }
// }
