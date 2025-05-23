import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    //Function to handle form submission for registration
    async function register(ev){
        ev.preventDefault();
        //Send POST request to backend registration endpoint
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        });           
        if (response.status !== 200) {
            alert('Registration failed');
        } else {
            alert('Registration successful');
        }
    }
    return (
        <div>
            <form className="register" onSubmit={register}> 
                <h1>Register</h1>
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
                <button>Register</button>
            </form>
        </div>
    );
}