import { Router } from "express";
import { getUsers, getUser, deleteUser, updateUser } from "../controllers/user.controller.js";
import  authorize  from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', getUsers); // Get all users 

userRouter.get('/:id', authorize, getUser); // Get user by ID

userRouter.put('/:id', authorize, updateUser); // Update user by ID

userRouter.delete('/:id', authorize, deleteUser); // Delete user by ID

export default userRouter;