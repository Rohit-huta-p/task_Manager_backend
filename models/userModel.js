const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt= require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        // required: true,
    }, 
    password: {
        type: String,
        // required: true,
    },
    tasks: [
        {
            title: String, 
            description: String,
            status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date },
        }
    ]
}, {
    timestamps: true
})

userSchema.pre('save', function (next) {
    this.tasks.forEach(task => {
      if (task.isModified) {
        task.updatedAt = new Date();
      }
    });
    next();
  });

userSchema.statics.encyptPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.log('Error hashing the password', error);
        throw error;
    }
}

userSchema.statics.comparePass = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if(isMatch) return true
    } catch (error) {
        console.log("Password does not match", error);
        throw error;
    }
}


userSchema.statics.generateToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "12h"} )
}



const userModel = new mongoose.model("users", userSchema);

module.exports = userModel;