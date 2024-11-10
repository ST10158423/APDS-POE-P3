import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { fullName, idNumber, accountNumber, username, email, password, role } = req.body;

  if (!fullName || !idNumber || !accountNumber || !username || !email || !password) {
    console.log("Registration error: Missing required fields", { fullName, idNumber, accountNumber, username, email });
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { accountNumber }] });
    if (existingUser) {
      console.log("Registration error: Username or account number already exists", { username, accountNumber });
      return res.status(400).json({ message: 'Username or account number already taken' });
    }

    // Trim the password to remove any accidental whitespace
    const trimmedPassword = password.trim();

    // Hash the password with Argon2
    const hashedPassword = await argon2.hash(trimmedPassword);

    const newUser = new User({
      fullName,
      idNumber,
      accountNumber,
      username,
      email,
      password: hashedPassword,
      role: role || 'customer',  // Default role if none provided
    });

    await newUser.save();
    console.log("User registered successfully", { username, accountNumber });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  const { username, accountNumber, password } = req.body;

  if (!username || !accountNumber || !password) {
    console.log("Login error: Missing required fields", { username, accountNumber });
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Find the user by username and account number
    const user = await User.findOne({ username, accountNumber });
    if (!user) {
      console.log("Login error: User not found", { username, accountNumber });
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User retrieved from database for login", { username: user.username, accountNumber: user.accountNumber });

    // Trim the password to remove any accidental whitespace
    const trimmedPassword = password.trim();

    // Verify the password with Argon2
    const isMatch = await argon2.verify(user.password, trimmedPassword);
    console.log("Password comparison result:", isMatch);

    if (!isMatch) {
      console.log("Login error: Invalid password for user", { username, accountNumber });
      return res.status(400).json({ message: 'Invalid password' });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is missing.");
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("JWT generated successfully", { token });

    res.json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

export default router;
