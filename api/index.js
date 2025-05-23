// Import required modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs'); //For hashing passwords
const jwt = require('jsonwebtoken'); //For creating/verifying tokens
const cookieParser = require('cookie-parser'); //To read cookies
const multer = require('multer'); //For handling file uploads
const fs = require('fs');

const app = express(); //Initialize Express app
const uploadMiddleware = multer({ dest: 'uploads/' }); //Handles file uploads to the uploads/ directory.

//Secret key for JWT and salt for password hashing
const secret = 'dhjafcknajfhbuesbv';
const salt= bcrypt.genSaltSync(10);

//Middleware setup
app.use(cors({credentials: true, origin: 'http://localhost:3000'})); //Allow frontend to make requests
app.use(express.json()); //Parses incoming JSON request bodies.
app.use(cookieParser()); //Reads cookies from the request.
app.use('/uploads', express.static(__dirname + '/uploads')); //Serves uploaded images from the /uploads folder.

// Connects to MongoDB using Mongoose.
mongoose.connect('mongodb+srv://blog:p3HZ0eDzF3tg0gea@cluster0.fr6rtdb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

// ======================
// USER AUTH ROUTES
// ======================

//Registers a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try{
      //Create and store new user with hashed password
        const userDoc = await User.create({ 
            username,
            password: bcrypt.hashSync(password, salt),
        })
        res.json(userDoc); //Return created user
    } catch(e) {
        console.log(e);
        res.status(400).json(e); //Handle duplicate username or other errors
    }
});

//Login user and issue JWT token
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password); //Check if password matches
    if (passOk) {
      //Sign JWT and send it as a cookie
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

//Get current user's profile info from token
app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

//Log the user out by clearing the token cookie
app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

// ======================
// POST CRUD ROUTES
// ======================

//Create a new post
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    //Handle uploaded image and rename it with proper extension
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        //Create the post with the logged-in user as the author
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

//Update an existing post
app.put('/post', uploadMiddleware.single('file'),async (req, res) => {
    let newPath = null;
    //Handle new image file if uploaded
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
        //Check if current user is the author
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }
        //Update the post
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        postDoc.cover = newPath ? newPath : postDoc.cover;

        await postDoc.save();
        res.json({postDoc});
    });
});

//Delete a post
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

//Get all posts with author username populated
app.get('/post', async (req, res) => {
    res.json(await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
});

//Get a specific post by ID
app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc)
});

app.listen(4000);