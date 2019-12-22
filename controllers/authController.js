const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};


exports.signup = catchAsync(async (req,res,next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token: token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    // 1) check if email and password exist
    if(!email || !password){
        return next(new AppError('Please provide email and password'));
    }
    // 2) check if user exists && password is correct
    // we use select to grab another field and add the + in front of password
    // because we set password select to false so it won't appear when you query for it
    const user = await User.findOne({ email: email }).select('+password');
    // const correct = await user.correctPassword(password, user.password);

    if( !user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) if everything is okay, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token: token
    })
});

exports.protect = catchAsync(async (req, res, next) => {

    let token;

    // 1) Getting token and checking if its there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    console.log(token);

    if(!token){
        return next(new AppError('You are not logged in. Please log in to get access.', 401))
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
    // 3) Check if the user still exists
    const freshUser = await User.findById(decoded.id);
    if(!freshUser){
        return next(new AppError('The user belonging to this token no longer exists', 401));
    }
    // 4) Check if user changed password after the JWT was issued
    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please log in again'));
    }


    //GRANT ACCESS TO PROTECTED ROUTE
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    }
};

exports.forgotPassword = catchAsync(async (req, res, next) => {

    // 1) Get user based onf POSTed email
    const user = await User.findOne({ email: req.body.email });
    if(!user){
        return next(new AppError('There is no user with that email address', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email

});
exports.resetPassword = (req, res, next) => {

};