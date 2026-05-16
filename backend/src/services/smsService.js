const EMAILJS_API = 'https://api.emailjs.com/api/v1.0/email/send';

const sendOTPEmail = async (toEmail, code) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const userId = process.env.EMAILJS_USER_ID;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !userId) {
    console.log(`[OTP EMAIL] Göndərildi -> ${toEmail}`);
    console.log(`[OTP EMAIL] Kod: ${code}`);
    console.log(`[OTP EMAIL] Xəbərdarlıq: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID .env faylında tapılmadı`);
    return true;
  }

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (privateKey) headers['Authorization'] = `Bearer ${privateKey}`;

    const res = await fetch(EMAILJS_API, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: userId,
        accessToken: privateKey,
        template_params: {
          email: toEmail,
          otp_code: code,
          message: `OTP kodunuz: ${code}`,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`EmailJS xətası (${res.status}): ${text}`);
    }

    console.log(`[OTP EMAIL] Uğurla göndərildi -> ${toEmail}`);
    return true;
  } catch (error) {
    console.error('[OTP EMAIL] Göndərilmə xətası:', error.message);
    return false;
  }
};

const sendSMS = async (phone, message) => {
  console.log(`[SMS] Göndərildi -> ${phone}`);
  console.log(`[SMS] Mesaj: ${message}`);
  return true;
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { sendSMS, generateOTP, sendOTPEmail };
