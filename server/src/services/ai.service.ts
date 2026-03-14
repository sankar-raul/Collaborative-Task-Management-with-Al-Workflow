import { GoogleGenerativeAI } from "@google/generative-ai";
import TechStackService from "./techstack.service";
import { ITechstack } from "@/types/interface/techstack.interface";

class AIService {
  private static readonly MODEL_NAME = "gemini-2.5-flash";

  private static getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    return new GoogleGenerativeAI(apiKey);
  }

  private static sanitizeModelOutput(output: string) {
    const trimmed = output.trim();

    // Gemini can wrap JSON in markdown fences. Strip them before parsing.
    const codeBlockMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    return codeBlockMatch ? codeBlockMatch[1].trim() : trimmed;
  }

  private static getErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "Unknown AI service error";
  }

  static async generateTasks(
    description: string,
    deadline: string,
    team: unknown[],
  ) {
    if (!description?.trim()) {
      throw new Error(
        "AI task generation failed: project description is required",
      );
    }

    if (!deadline?.trim()) {
      throw new Error(
        "AI task generation failed: project deadline is required",
      );
    }

    if (!Array.isArray(team) || team.length === 0) {
      throw new Error(
        "AI task generation failed: team must be a non-empty array",
      );
    }

    try {
      const genAI = this.getClient();
      const model = genAI.getGenerativeModel({ model: this.MODEL_NAME });

      const prompt = `
Project Description:
${description}

Project Deadline:
${deadline}

Team Members and Skills:
${JSON.stringify(team)}

Generate tasks for this project.

Rules:
1. Break the project into tasks
2. Assign tasks based on team skills
3. Each task must contain:
   - title
   - description
   - estimatedHours
   - skillsRequired
   - deadline

Return response in JSON format only.
`;

      const result = await model.generateContent(prompt);
      const responseText = result?.response?.text?.();

      if (!responseText || !responseText.trim()) {
        throw new Error("AI model returned an empty response");
      }

      const sanitized = this.sanitizeModelOutput(responseText);

      try {
        return JSON.parse(sanitized);
      } catch {
        throw new Error("AI model returned non-JSON content");
      }
    } catch (error) {
      throw new Error(
        `AI task generation failed: ${this.getErrorMessage(error)}`,
      );
    }
  }

  static async getStacksBasedOnSkills(skills: string[]) {
    try {
      const stacks = await TechStackService.getAll();
      const genAI = this.getClient();
      const model = genAI.getGenerativeModel({ model: this.MODEL_NAME });

      const prompt = `
User Skills:
${JSON.stringify(skills)}

Available Tech Stacks:
${JSON.stringify(stacks)}

Task:
Determine which stacks are suitable for the user based on their skills.

Matching Rule:
A stack is suitable if at least ONE skill from the user's skills exists in the stack's "availableSkills" array.

Important Rules:
1. Only select stacks from the provided "Available Tech Stacks".
2. Do NOT invent new stacks.
3. Ignore user skills that are not listed in a stack's "availableSkills".
4. A stack must be selected if there is at least one matching skill.
5. Return ONLY valid JSON. No explanations.

Output format:
{
  "selectedStacks": [
    {
      "_id": "",
      "name": ""
    }
  ]
}
`;

      const result = await model.generateContent(prompt);
      const responseText = result?.response?.text?.();
      if (!responseText || !responseText.trim()) {
        throw new Error("AI model returned an empty response");
      }

      const sanitized = this.sanitizeModelOutput(responseText);

      try {
        return JSON.parse(sanitized) as { selectedStacks: Partial<ITechstack>[]};
      } catch {
        throw new Error("AI model returned non-JSON content");
      }
    } catch (error) {
      throw new Error(
        `AI stack selection failed: ${this.getErrorMessage(error)}`,
      );
    }
  }
}

export default AIService;
export const generateTasks = AIService.generateTasks.bind(AIService);
