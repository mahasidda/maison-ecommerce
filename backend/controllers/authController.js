const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
    });
    try {
      const { sendWelcomeEmail } = require('../utils/sendEmail');
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailErr) {
      console.error('Welcome email error:', emailErr.message);
    }
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('User found:', user ? 'yes' : 'no');
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (address) user.address = address;
    await user.save();
    res.json({
      _id: user._id, name: user.name,
      email: user.email, role: user.role,
      address: user.address, token: req.headers.authorization?.split(' ')[1],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };