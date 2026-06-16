require('dotenv').config();
const expree = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = expree();
const PORT = 3000;

const userRouter = require('./routes/user');
const postRouter = require('./routes/posts');
const contactRouter = require('./routes/contacts');

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(expree.json());
app.use(expree.urlencoded({ extended: true }));
app.use(cookieParser());

// 정적 파일 제공 설정 (업로드된 이미지 및 파일 접근용)
app.use('/uploads', expree.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/contacts', contactRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB와 연결이 되었습니다.');
  })
  .catch((err) => {
    console.log('MongoDB 연결에 실패했습니다:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
