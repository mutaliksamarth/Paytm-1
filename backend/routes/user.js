const express = require('express');
const router = express.Router();
const zod = require('zod');
const { User, Account } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('../middleware');

// Schema for user signup
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});

// Signup route
router.post('/signup', async (req, res) => {
    const parseResult = signupBody.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: 'Invalid input: ' + parseResult.error.issues.map(issue => issue.message).join(', ')
        });
    }

    const { username, firstName, lastName, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(411).json({ message: 'Email already taken' });
    }

    // Create a new user
    const user = await User.create({ username, password, firstName, lastName });
    const userId = user._id;

    // Create an account with a random balance
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    // Generate a JWT token
    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        message: 'User created successfully',
        token
    });
});

// Schema for user signin
const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

// Signin route
router.post('/signin', async (req, res) => {
    // Validate input
    const parseResult = signinBody.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: 'Invalid input: ' + parseResult.error.issues.map(issue => issue.message).join(', ')
        });
    }

    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Send the token back to the client
        res.json({ token });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Schema for updating user details
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

// Update user route
router.put('/', authMiddleware, async (req, res) => {
    const parseResult = updateBody.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: 'Invalid input: ' + parseResult.error.issues.map(issue => issue.message).join(', ')
        });
    }

    const { password, firstName, lastName } = req.body;

    // Update user data
    await User.updateOne(
        { _id: req.userId },  // Use _id from the JWT token
        { $set: { password, firstName, lastName } }
    );

    res.json({
        message: 'Updated successfully'
    });
});

// Fetch user profile route (GET /me)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId, 'firstName lastName username');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Bulk user search route
router.get('/bulk', async (req, res) => {
    const filter = req.query.filter || '';

    // Search for users by firstName or lastName
    const users = await User.find({
        $or: [
            { firstName: { $regex: filter, $options: 'i' } },
            { lastName: { $regex: filter, $options: 'i' } }
        ]
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

module.exports = router;
