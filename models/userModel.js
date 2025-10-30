const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name required'],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: [true, 'email must be unique'],
        lowercase: true
    },
    password: {
         type: String,
        required: [true, 'password required'],
        minlength: [6, 'Too short password'],
        trim: true
    },
    phone: String,
    profileImg: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})


const User = mongoose.model('User', userSchema)
module.exports = User