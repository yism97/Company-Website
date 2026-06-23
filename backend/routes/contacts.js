const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const jwt = require('jsonwebtoken');

// 미들웨어: 관리자 인증 확인
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: '인증이 필요합니다.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

// 모든 문의 조회 (관리자용)
router.get('/', authenticate, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 문의 상태 변경
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 문의 삭제
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: '문의가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 문의 작성 (공개용)
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const contact = new Contact({ name, email, phone, subject, message });

  try {
    const newContact = await contact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
