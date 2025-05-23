import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false); //State to handle redirection after successful login
    const {setUserInfo} = useContext(UserContext); //Access setUserInfo function from UserContext to update user state globally

    //Function to handle login form submission
    async function login(ev) {
        ev.preventDefault();
        //Send POST request to backend login endpoint with username and password
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true); //Trigger redirect to homepage
            });
        } else {
            //If login failed, show alert to user
            alert("Wrong credentials");
        }
    }
    
    //If redirect state is true, navigate to homepage
    if (redirect) {
        return <Navigate to={'/'}/>
    }
    
    return(
        <div>
            <form className="login" onSubmit={login}>
                <h1>Login</h1>
                <input type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={ev => setUsername(ev.target.value)}
                />
                <input type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={ev => setPassword(ev.target.value)}
                />
                <button>Login</button>
            </form>
        </div>
    );    
}