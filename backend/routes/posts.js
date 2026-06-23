const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// multer 설정: 파일 저장 위치 및 이름 지정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // 한글 파일명 깨짐 방지 (latin1 -> utf8 변환)
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(originalName));
  }
});

const upload = multer({ storage: storage });

// 미들웨어: 관리자 인증 확인
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: '인증이 필요합니다.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

// 모든 게시글 조회
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 특정 게시글 조회
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 게시글 작성 (파일 업로드 포함)
router.post('/', authenticate, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'attachments', maxCount: 10 }
]), async (req, res) => {
  const { title, content, category } = req.body;
  
  const images = req.files['images'] ? req.files['images'].map(file => ({
    url: `/uploads/${file.filename}`,
    name: Buffer.from(file.originalname, 'latin1').toString('utf8')
  })) : [];

  const attachments = req.files['attachments'] ? req.files['attachments'].map(file => ({
    url: `/uploads/${file.filename}`,
    name: Buffer.from(file.originalname, 'latin1').toString('utf8')
  })) : [];

  const post = new Post({
    title,
    content,
    category,
    author: req.userId,
    images,
    attachments
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 게시글 수정 (파일 업로드 포함)
router.put('/:id', authenticate, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'attachments', maxCount: 10 }
]), async (req, res) => {
  try {
    const { title, content, category, existingImages, existingAttachments } = req.body;
    
    // 기존 파일들 (프론트에서 남겨둔 파일들)
    let finalImages = existingImages ? JSON.parse(existingImages) : [];
    let finalAttachments = existingAttachments ? JSON.parse(existingAttachments) : [];

    // 새로 업로드된 파일들 추가
    if (req.files['images']) {
      const newImages = req.files['images'].map(file => ({
        url: `/uploads/${file.filename}`,
        name: Buffer.from(file.originalname, 'latin1').toString('utf8')
      }));
      finalImages = [...finalImages, ...newImages];
    }

    if (req.files['attachments']) {
      const newAttachments = req.files['attachments'].map(file => ({
        url: `/uploads/${file.filename}`,
        name: Buffer.from(file.originalname, 'latin1').toString('utf8')
      }));
      finalAttachments = [...finalAttachments, ...newAttachments];
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        content, 
        category, 
        images: finalImages,
        attachments: finalAttachments,
        updatedAt: Date.now() 
      },
      { returnDocument: 'after' }
    );

    res.json(updatedPost);
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    res.status(400).json({ message: error.message });
  }
});

// 게시글 삭제
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 파일 다운로드 전용 라우트 (브라우저 미리보기 방지)
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  
  // 파일이 실제로 존재하는지 확인
  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        if (!res.headersSent) {
          res.status(500).json({ message: "파일 다운로드 중 오류가 발생했습니다." });
        }
      }
    });
  } else {
    res.status(404).json({ message: "파일을 찾을 수 없습니다." });
  }
});

module.exports = router;
