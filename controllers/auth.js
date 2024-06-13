const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors');
const notFound = require('../middleware/not-found');

const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token,
        },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials');
    }
    // compare password
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token,
        },
    });
};

const updateUser = async (req, res) => {
    const {
        body: { name, lastName, location },
        user: { userId },
    } = req;

    if (!name || !lastName || !location) {
        throw new BadRequestError('Please provide all value');
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new NotFoundError(`No user With id ${userId}`);
    }
    user.name = name;
    user.location = location;
    user.lastName = lastName;

    await user.save();
    const token = await user.createJWT();
    res.status(StatusCodes.OK).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token,
        },
    });
};

module.exports = {
    register,
    login,
    updateUser,
};
