import TechStackModel from "@/models/techstack/techstack.model"
import { ITechstack } from "@/types/interface/techstack.interface"

class TechStackService {

    static async getAll() {
        // Implement fetching all tech stacks here
        try {
            return await TechStackModel.find();
        } catch (error) {
            throw error;
        }
    }

    static async create(task: ITechstack) {
        try {
            const stack = new TechStackModel({
                name: task.name,
                skills: task.skills
            })
            await stack.save()
            return stack
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    static async delete(id: string) {
        try {
            await TechStackModel.findByIdAndDelete(id) 
        } catch (error) {
            throw error;
        }
    }

}

export default TechStackService