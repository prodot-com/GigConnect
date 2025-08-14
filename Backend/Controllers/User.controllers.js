import { User } from "../models/User.models.js";
import bcrypt from 'bcrypt'
import ApiError from '../src/Utils/ApiError.js'
import {z} from 'zod'
import jwt from 'jsonwebtoken'
const JWT_SECRET = "gigConnect"


const registerUser = async (req, res)=>{

    try {
        const{name, email, password, role} = req.body

        if(!name || !email || !password || !role){
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const requiredBody = z.object({
        name: z.string().min(3).max(50),
        email: z.string().min(4).max(15).email(),
        password: z.string().min(3),
        role: z.string()
    })

    const parseDatawithsuccess = requiredBody.safeParse(req.body);
    

    if(!parseDatawithsuccess.success){
        const parsedErrors = JSON.parse(parseDatawithsuccess.error.message);
        const validationMessage = parsedErrors[0]?.message;
        res.status(400).json({
            message: "incorrect Input Format",
            error: validationMessage
        })
        console.log(validationMessage);
        return
    }

        console.log(name, email, password, role)

        if(!['client', 'freelancer'].includes(role)){
            return res.status(400).json({
                message: 'Role must be selected'
            })
        }

        const existedUser = await User.findOne({email})
        if(existedUser){
            return res.status(400).json({
                message: 'User already exist'
            })
        }

        const hashpass = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            email,
            password: hashpass,
            role
        })

        if(!newUser){
            return res.status(400).json({
                message: "Something went wrong"
            })
        }

        res.status(200).json({
            message: "Succesfull",
            User: {
                ID: newUser._id,
                Name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                role: newUser.role,
            }
        })


    } catch (error) {
        throw new ApiError(400, error)
    }

}

const signIn = async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    console.log(email, password)

    const user = await User.findOne({
        email
    })

    if(!user){
        return res.status(403).json({
            message: "Your does not have account!"
        })
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log(user)

    if(passwordMatch){
        const token = jwt.sign({
            id: user._id.toString()
        }, process.env.JWT_SECRET);
        res.json({
                token: token
        })
    }else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }

};

export {registerUser, signIn}