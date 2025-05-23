import './App.css';  // Import global CSS styles
import { Route, Routes } from 'react-router-dom';  // Import React Router components for routing
import { UserContextProvider } from './UserContext';  // Context provider for user authentication state
import Layout from './Layout';  // Layout component that wraps all pages (e.g., header, footer)
import IndexPage from './pages/IndexPage';  // Homepage listing posts
import LoginPage from './pages/LoginPage';  // Login form page
import RegisterPage from './pages/RegisterPage';  // Registration form page
import CreatePost from './pages/CreatePost';  // Page to create a new post
import PostPage from './pages/PostPage';  // Page to view a single post
import EditPost from './pages/EditPost';  // Page to edit an existing post

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<IndexPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/create" element={<CreatePost/>}/>
          <Route path="/post/:id" element={<PostPage/>}/>
          <Route path="/edit/:id" element={<EditPost/>}/>
        </Route>
      </Routes> 
    </UserContextProvider>
  );
}

export default App;