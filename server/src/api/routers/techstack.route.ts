import { Router } from 'express';
import { createTechstack, deleteTechstack, getTechstacks } from '../controllers/techstack.controller';
import adminAuth from '../middleware/adminAuth';
const techstackRouter = Router();

techstackRouter.post("/", adminAuth, createTechstack) // Create a new techstack
techstackRouter.get("/", getTechstacks) // Get all techstacks
techstackRouter.delete("/:id", adminAuth, deleteTechstack) // Delete a techstack by ID

export default techstackRouter;