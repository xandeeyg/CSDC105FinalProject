import './App.css';
import { Link } from "react-router-dom"
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
    const {setUserInfo, userInfo} = useContext(UserContext);
    //Fetch current user profile info to check if logged in
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include', //Send cookies for authentication
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo); //Update user info in context
            });
        })
    }, []);
    //Logout function to call backend logout endpoint and clear user info
    function logout() {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
    }

    const username = userInfo?.username;
    return(
        <header>
            <Link to="/" className="Logo">MunchMatch</Link>
            <nav>
                {/* If user is logged in, show create post link and logout button */}
                {username && (
                    <>
                    <Link to ="/create">Create new post</Link>
                    <a onClick={logout}>Logout</a>
                    </>
                )}
                {/* If no user logged in, show login and register button */}
                {!username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>   
    )
}