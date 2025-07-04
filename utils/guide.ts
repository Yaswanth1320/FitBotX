import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env.EXPO_PUBLIC_GITHUB_OPENAI_API_KEY;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

export async function AiGuide(exerciseName) {
  const client = ModelClient(endpoint, new AzureKeyCredential(token));

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

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 1.0,
      top_p: 1.0,
      model: model,
    },
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  return response.body.choices[0].message.content;
}
