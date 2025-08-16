import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import ApiError from '../src/Utils/ApiError.js'
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['client', 'freelancer'])
});

export const registerUser = async (req, res, next) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
    const firstError = parsed.error?.errors?.[0]?.message || 'Invalid input data';
    return res.status(500).json({
                message: firstError
            })
}


        const { name, email, password, role } = parsed.data;

        const existing = await User.findOne({ email });
        if (existing){
            return res.status(500).json({
                message: 'User already exist'
            })
        }

        const hashed = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name, email, password: hashed, role
        });

        res.status(201).json({ 
            success: true,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return next(new ApiError(400, 'Invalid credentials'));

        const match = await bcrypt.compare(password, user.password);
        if (!match) return next(new ApiError(400, 'Invalid credentials'));

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ success: true, token });
    } catch (error) {
        next(error);
    }
};
