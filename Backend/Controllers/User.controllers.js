import { User } from "../models/User.models.js";
import bcrypt from 'bcrypt'


const registerUser = async (req, res)=>{

    try {
        const{name, email, password, role} = req.body

        if(!name || !email || !password || !role){
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

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
            hashpass,
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
        console.log('####')
    }

}

export {registerUser}