import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Client', 'Freelancer'], required: true },
    skills: [String],
    portfolio: String,
    rate: Number,
    reviews: [{ type: String }],
}, { timestamps: true });


UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});



UserSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model('User', UserSchema);
