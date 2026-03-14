import TechStackService from "@/services/techstack.service"
import { ITechstack } from "@/types/interface/techstack.interface"
import { Request, Response } from "express"
export const createTechstack = async (req: Request, res: Response) => {
    const { name, skills } = req.body as ITechstack || {}

    if (!name) {
        res.status(400).json({ success: false, message: "Techstack name is required" })
        return
    }
    try {
        const stack = await TechStackService.create({ name, skills })
        res.status(201).json({ success: true, data: stack })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    } 
}

export const deleteTechstack = async (req: Request, res: Response) => {
    const id = req.params.id as string
    try {
        await TechStackService.delete(id)
        res.status(200).json({ success: true, message: "Techstack deleted successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getTechstacks = async (req: Request, res: Response) => {
    try {
        const stacks = await TechStackService.getAll()
        res.status(200).json({ success: true, data: stacks })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}