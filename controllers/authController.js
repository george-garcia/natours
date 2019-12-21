const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.signup = catchAsync(async (req,res,next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

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
    const user = User.findOne({ email: email }).select('+password');
    const correct = await user.correctPassword(password, user.password);

    if( !user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) if everything is okay, send token to client
    const token = '';
    res.status(200).json({
        status: 'success',
        token: token
    })
});