### Project Overview

**Fullstack Blog App using MERN**

This application is a full-stack blog platform built using the MERN (MongoDB, Express.js, React, Node.js) stack. It allows users to view blog posts, and authenticated users to create, edit, and delete their own posts. The platform provides a rich text editor for creating engaging content and supports image uploads for enhanced blog posts.

**Main Features:**

- Secure user registration and login functionality using JSON Web Tokens (JWT).
- Authenticated users can create new blog posts, view existing posts, edit their own posts, and delete them.
- Utilizes a rich text editor to allow users to format their blog post content with various styles, including headings, lists, and embedded images.
- Functionality for uploading and embedding images within blog posts.
- Displays blog posts with titles, summaries, cover images, content, and creation dates.
- Ensures that only the author of a post can edit or delete it.
- Clear navigation between the homepage displaying all posts and individual post editing pages.

---

### Technologies Used

- MongoDB - A NoSQL database used to store blog post data and user information.
- Express.js -A minimalist and flexible Node.js web application framework.
- React - A JavaScript library for building user interfaces.
- Node.js - The JavaScript runtime environment for the server-side.
- Mongoose - An Object Data Modeling (ODM) library for MongoDB and Node.js, providing a higher-level interface for interacting with the database.
- cors - Middleware to enable Cross-Origin Resource Sharing.
- nodemon - A development dependency that automatically restarts the Node.js server when file changes are detected.
- react-router-dom - A library providing routing functionality for React applications (for navigation between different views).
- bcrypt js - A library for hashing passwords securely.
- jsonwebtoken - Used for generating and verifying JSON Web Tokens for user authentication.
- cookieparser
- react quill - A rich text editor component for React.
- multer - Middleware for handling `multipart/form-data`, which is primarily used for uploading files.
- react time ago - A component that displays dates and times in a human-readable "time ago" format.

---

### Setup Instructions

1. **Clone the Repository:**
Open your terminal and navigate to the directory where you want to clone the project. Then, run the following command:
    
    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```
    
2. **Install Backend Dependencies:**
Navigate to the backend directory:
    
    ```bash
    cd api
    npm install
    ```
    
3. **Install Frontend Dependencies:**
Navigate to the frontend directory:
    
    ```bash
    cd client
    npm install
    ```
    
4. **Run the Backend Server:**
Navigate to the backend directory in your terminal and run:
    
    ```bash
    nodemon index.js
    ```
    
    This will start the Express.js server.
    
5. **Run the Frontend Development Server:**
Open a new terminal window, navigate to the frontend directory, and run:
    
    ```bash
    npm start
    ```
    
    This will start the React development server.
    

---

### Folder Structure

Explain the folder structure of the project:

- Backend: Routes, models, controllers, etc.
- Frontend: Components, pages, assets, etc.

CSDC105 Final Project/
├── api/                           # Backend
│   ├── models/
│   │   └── User.js          # Defines the User schema for MongoDB
│   │   └── Post.js          # Defines the Post schema for MongoDB
│   ├── uploads/
│   │   └── # This where the uploaded images goes to
│   ├── index.js               # The main entry point for the backend application
├── client/                       # Frontend
│   ├── public/
│   │   └── index.html       # The main HTML file
│   │   └── ...              # Other public assets
│   ├── src/
│   │   ├── pages/
│   │   │   └── CreatePost.js       # Page for creating a new blog post
│   │   │   └── EditPost.js             # Page for editing an existing blog post 
│   │   │   └── IndexPage.js         # Page for displaying all blog posts 
│   │   │   └── LoginPage.js         # Page for user login
│   │   │   └── PostPage.js           # Page for displaying a single post
│   │   │   └── RegisterPage.js    # Page for user registration
│   │   ├── App.css            # Global styles for the application 
│   │   ├── App.js               # The root component of the React application
│   │   ├── DeletePostButton.jsx       # 
│   │   ├── Editor.js       # 
│   │   ├── Header.js       # 
│   │   ├── index.css          # Entry point for the frontend application
│   │   ├── index.js       # 
│   │   ├── Layout.js       # 
│   │   ├── Post.js       # 
│   │   ├── UserContext.js       # 
│   │   └── ...
│   └── package.json
├── .gitignore
├── README.md                  # Project documentation
└── package-lock.json       # For both backend and frontend
---

### Code Explanation

Backend: Explain the API routes, database models, and middleware.

Frontend: Explain the React components, state management, and API calls.

---

### Challenges Faced

Initially, the Blog App wasn’t my first choice—I intended to work on the Booking App. However, I ran into errors right from the start (npm error could not determine executable to run), and despite searching online, I couldn’t find a solution. I then tried other project options, but the same error persisted. Eventually, I gave the Blog App a try, and surprisingly, those previous errors didn’t appear, so I decided to proceed with it. While working on the Blog App, I experienced frequent crashes with Nodemon, which I later discovered were caused by an incorrect import from the frontend that wasn’t supposed to be there.

![image.png](attachment:bd299f96-e972-4d0f-b8f5-ddf419ab92d0:image.png)

---

### Future Improvements

Suggest potential features or improvements for the application (e.g., adding user authentication, improving UI, etc.).

---

### Screenshots

Include screenshots of the application (e.g., homepage, forms, etc.).

---

### Others.

Include photos of you and/or you partner while doing your code.

---
