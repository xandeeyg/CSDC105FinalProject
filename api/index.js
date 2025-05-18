const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const secret = 'dhjafcknajfhbuesbv';
const salt= bcrypt.genSaltSync(10);

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// MongoDB connection
mongoose.connect('mongodb+srv://blog:p3HZ0eDzF3tg0gea@cluster0.fr6rtdb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try{
        const userDoc = await User.create({ 
            username,
            password: bcrypt.hashSync(password, salt),
        })
        res.json(userDoc);
    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
       jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
       });
    } else {
        res.status(400).json('Wrong credentials');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json({postDoc});
    });
});

app.put('/post', uploadMiddleware.single('file'),async (req, res) => {
    let newPath = null;
    if (req.file){
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        postDoc.cover = newPath ? newPath : postDoc.cover;

        await postDoc.save();
        res.json({postDoc});
    });
});

app.delete("/post/:id", async (req, res) => {
  const { id } = req.params
  const { token } = req.cookies

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  try {
    // Verify the user from the token
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" })
      }

      // Find the post
      const postDoc = await Post.findById(id)

      if (!postDoc) {
        return res.status(404).json({ error: "Post not found" })
      }

      // Check if the user is the author
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)

      if (!isAuthor) {
        return res.status(403).json({ error: "You are not the author of this post" })
      }

      // Delete the post
      await Post.findByIdAndDelete(id)

      // If the post has a cover image, delete it too
      if (postDoc.cover) {
        try {
          fs.unlinkSync(postDoc.cover)
        } catch (e) {
          console.log("Error deleting cover image:", e)
          // Continue even if image deletion fails
        }
      }

      res.json({ message: "Post deleted successfully" })
    })
  } catch (error) {
    console.error("Error deleting post:", error)
    res.status(500).json({ error: "Failed to delete post" })
  }
});

app.get('/post', async (req, res) => {
    res.json(await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc)
});

app.listen(4000);