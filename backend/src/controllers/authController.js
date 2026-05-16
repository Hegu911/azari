const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!phone) return res.status(400).json({ message: 'Telefon nömrəsi tələb olunur' });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email artıq qeydiyyatdan keçib' });
    }

    const cleanedPhone = phone.replace(/\s|-/g, '');
    if (!cleanedPhone.startsWith('+994') || cleanedPhone.length !== 13) {
      return res.status(400).json({ message: 'Düzgün Azərbaycan nömrəsi daxil edin (+994 XX XXX XX XX)' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, phone: cleanedPhone, phoneVerified: false },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    await prisma.cart.create({ data: { userId: user.id } });

    res.status(201).json({ user, requiresPhoneVerification: true });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, phoneVerified: user.phoneVerified, role: user.role },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phone: true, phoneVerified: true, address: true, avatar: true, role: true, createdAt: true },
    });
    res.json(user);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone, address },
      select: { id: true, name: true, email: true, phone: true, phoneVerified: true, address: true, avatar: true, role: true },
    });
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getMe, updateProfile };
