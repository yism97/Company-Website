require('dotenv').config();
const expree = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = expree();
const PORT = 3000;

const userRouter = require('./routes/user');

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(expree.json());
app.use(expree.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', userRouter);

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
