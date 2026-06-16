const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const axios = require('axios');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: '이미 사용중인 아이디입니다.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    if (!user.isActive) {
      return res.status(400).json({
        message: '비활성화된 계정입니다. 관리자에게 문의하세요.',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      user.failedLoginAttempts += 1;
      user.lastLoginAttempt = new Date();

      if (user.failedLoginAttempts >= 5) {
        user.isActive = false;
        await user.save();
        return res.status(401).json({
          message: '비밀번호를 5회 이상 틀려 계정이 비활성화되었습니다.',
        });
      }
      await user.save();
      return res.status(401).json({
        message: '비밀번호가 일치하지 않습니다.',
        remainingAttempts: 5 - user.failedLoginAttempts,
      });
    }

    user.failedLoginAttempts = 0;
    user.lastLoginAttempt = new Date();
    user.isLoggedIn = true;

    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = response.data.ip;
      user.ipAddress = ipAddress;
    } catch (error) {
      console.error('IP 주소 가져오기 실패', error.message);
      // IP 주소 가져오기 실패해도 로그인은 계속 진행
    }
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
      },
    );
    
    console.log('토큰 생성:', token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({
      message: '로그인에 성공했습니다.',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: '이미 로그아웃된 계정입니다.' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (user) {
        user.isLoggedIn = false;
        await user.save();
      }
    } catch (error) {
      console.error('토큰 검증 오류:', error.message);
    }
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.status(200).json({ message: '로그아웃에 성공했습니다.' });
  } catch (error) {
    console.error('로그아웃 오류:', error.message);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

router.delete('/delete/:userId', async (req, res) => {
  try {
const user = await User.findByIdAndDelete(req.params.userId);
if(!user) {
  return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
}
res.status(200).json({ message: '사용자가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('계정 삭제 오류:', error.message);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

router.post("/verify-token", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ isValid: false, message: '토큰이 없습니다.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ isValid: false, message: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json({ isValid: true, message: '인증 토큰이 유효합니다.', user });
  } catch (error) {
    console.error('인증 토큰 검증 오류:', error.message);
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.status(401).json({ isValid: false, message: '인증 토큰이 유효하지 않습니다.' });
  }
});

module.exports = router;
