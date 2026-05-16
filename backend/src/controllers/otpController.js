const { prisma } = require('../config/database');
const { sendOTPEmail, generateOTP } = require('../services/smsService');
const generateToken = require('../utils/generateToken');

// In-memory OTP cache (dev prodda Redis və ya DB istifadə edin)
const otpCache = new Map();

const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Telefon nömrəsi tələb olunur' });

    // Azərbaycan nömrə formatı yoxlaması
    const cleaned = phone.replace(/\s|-/g, '');
    if (!cleaned.startsWith('+994') || cleaned.length !== 13) {
      return res.status(400).json({ message: 'Düzgün Azərbaycan nömrəsi daxil edin (+994 XX XXX XX XX)' });
    }

    const code = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 dəqiqə

    otpCache.set(cleaned, { code, expiresAt, attempts: 0 });

    // Kodu istifadəçinin emailinə göndər
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { email: true } });
    if (!user) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });

    await sendOTPEmail(user.email, code);

    res.json({ message: 'Təsdiq kodu emailinizə göndərildi', expiresIn: 300 });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ message: 'Telefon nömrəsi və kod tələb olunur' });

    const cleaned = phone.replace(/\s|-/g, '');
    const cached = otpCache.get(cleaned);

    if (!cached) return res.status(400).json({ message: 'Kod göndərilməyib və ya müddəti bitib' });
    if (Date.now() > cached.expiresAt) {
      otpCache.delete(cleaned);
      return res.status(400).json({ message: 'Kodun müddəti bitib' });
    }
    if (cached.attempts >= 5) {
      otpCache.delete(cleaned);
      return res.status(400).json({ message: 'Çox cəhd edildi, yenidən kod alın' });
    }

    if (cached.code !== code) {
      cached.attempts++;
      return res.status(400).json({ message: 'Yanlış kod' });
    }

    otpCache.delete(cleaned);

    // İstifadəçinin nömrəsini təsdiqlə
    if (req.user) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { phone: cleaned, phoneVerified: true },
      });
    }

    res.json({ message: 'Nömrə təsdiqləndi', verified: true });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const checkOTPStatus = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { phone: true, phoneVerified: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const sendOTPForRegister = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email tələb olunur' });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true, phone: true } });
    if (!user) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });

    const code = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpCache.set(`register:${email}`, { code, expiresAt, attempts: 0 });

    await sendOTPEmail(user.email, code);

    res.json({ message: 'Təsdiq kodu emailinizə göndərildi', expiresIn: 300 });
  } catch (error) {
    console.error('Send OTP register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyOTPForRegister = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Email və kod tələb olunur' });

    const cached = otpCache.get(`register:${email}`);
    if (!cached) return res.status(400).json({ message: 'Kod göndərilməyib və ya müddəti bitib' });
    if (Date.now() > cached.expiresAt) {
      otpCache.delete(`register:${email}`);
      return res.status(400).json({ message: 'Kodun müddəti bitib' });
    }
    if (cached.attempts >= 5) {
      otpCache.delete(`register:${email}`);
      return res.status(400).json({ message: 'Çox cəhd edildi, yenidən kod alın' });
    }

    if (cached.code !== code) {
      cached.attempts++;
      return res.status(400).json({ message: 'Yanlış kod' });
    }

    otpCache.delete(`register:${email}`);

    const user = await prisma.user.update({
      where: { email },
      data: { phoneVerified: true },
      select: { id: true, name: true, email: true, phone: true, phoneVerified: true, role: true },
    });

    const token = generateToken(user.id);

    res.json({ message: 'Nömrə təsdiqləndi', user, token, verified: true });
  } catch (error) {
    console.error('Verify OTP register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { sendOTP, verifyOTP, checkOTPStatus, sendOTPForRegister, verifyOTPForRegister };
