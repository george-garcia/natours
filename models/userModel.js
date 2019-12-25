const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name"],
    },
    email: {
        type: String,
        required: [true, "a user must have an email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role:{
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function(cur) {
                return cur === this.password;
            },
            message: "Passwords are not the same"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', async function(next){

    //Only run this function if the password was actually modified
    if(!this.isModified('password')) return next();

    //Hash this password with the cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //Delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();

    //We subtract 1 second from the date because there is some timing issues between
    //When this variable being saved and when the json web token is actually saved
    //If this gets saved after the token is issued then the user won't be able
    //to actually use their token
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next){
    // this points to the current query
    // this is query middleware
    this.find({ active: {$ne: false} });
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){

        // We the .getTime() function returns our time in milliseconds so we need to convert it to seconds
        // by dividing by 1000 and using parseInt
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;