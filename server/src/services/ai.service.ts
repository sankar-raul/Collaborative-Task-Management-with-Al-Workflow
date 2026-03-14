import TechStackModel from "@/models/techstack/techstack.model"
import { GoogleGenerativeAI } from "@google/generative-ai"

class AIService {
  private static readonly MODEL_NAME = "gemini-2.5-flash"

  private static getClient() {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured")
    }
    return new GoogleGenerativeAI(apiKey)
  }

  private static sanitizeModelOutput(output: string) {
    const trimmed = output.trim()

    // Gemini can wrap JSON in markdown fences. Strip them before parsing.
    const codeBlockMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
    return codeBlockMatch ? codeBlockMatch[1].trim() : trimmed
  }

  private static getErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === "string") {
      return error
    }
    return "Unknown AI service error"
  }

  static async generateTasks(
    description: string,
    deadline: string,
    techStack: string,
  ) {
    if (!description?.trim()) {
      throw new Error("AI task generation failed: project description is required")
    }

    if (!deadline?.trim()) {
      throw new Error("AI task generation failed: project deadline is required")
    }

    const skills = await TechStackModel.findOne({ _id: techStack })
    if (!skills) {
      throw new Error(`AI task generation failed: tech stack "${techStack}" not found`)
    }
   

    try {
      const genAI = this.getClient()
      const model = genAI.getGenerativeModel({ model: this.MODEL_NAME })

const prompt = `
You are an experienced Software Project Manager.

Your job is to analyze the project description and generate a detailed list of development tasks required to complete the project.

PROJECT INFORMATION
-------------------
Project Description:
${description}

Project Deadline:
${deadline}

Available Team Skills:
${JSON.stringify(skills)}

IMPORTANT RULES
---------------
1. Carefully analyze the project description.
2. Break the project into logical development tasks.
3. Tasks should cover all stages such as:
   - Planning
   - UI/Frontend Development
   - Backend Development
   - Database
   - API Integration
   - Testing
   - Deployment

4. ONLY use skills from the "Available Team Skills" list when generating tasks.

5. Each task must include the most relevant skill required to complete it.

6. If multiple skills are needed, include them in the skillsRequired array.

7. Tasks should be realistic for a software development team.

8. Distribute the tasks logically across the project timeline before the deadline.

9. Estimated hours should be realistic for a developer.

10. Tasks should be granular enough so they can be assigned individually.

OUTPUT FORMAT
-------------
Return ONLY valid JSON with the following structure.

{
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed explanation of what needs to be done",
      "estimatedHours": number,
      "skillsRequired": ["skill1","skill2"],
      "deadline": "YYYY-MM-DD"
    }
  ]
}

STRICT OUTPUT RULES
-------------------
- Return ONLY JSON.
- Do NOT include markdown.
- Do NOT include explanations.
- Do NOT include text outside the JSON.
- Ensure the JSON is valid and properly formatted.
`;


      const result = await model.generateContent(prompt)
      const responseText = result?.response?.text?.()

      if (!responseText || !responseText.trim()) {
        throw new Error("AI model returned an empty response")
      }

      const sanitized = this.sanitizeModelOutput(responseText)

      try {
        return JSON.parse(sanitized)
      } catch {
        throw new Error("AI model returned non-JSON content")
      }
    } catch (error) {
      throw new Error(`AI task generation failed: ${this.getErrorMessage(error)}`)
    }
  }
}

export default AIService
export const generateTasks = AIService.generateTasks.bind(AIService)