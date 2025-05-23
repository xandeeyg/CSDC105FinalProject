import "react-quill/dist/quill.snow.css"; // import styles
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false); //Controls redirect after post creation

    //Handler function for form submission to create a new post
    async function createNewPost(ev) {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        ev.preventDefault();
        //Send POST request to backend to create a new post
        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: 'include', //Include cookies for authentication
        });
        //If post creation succeeded, trigger redirect to homepage
        if (response.ok) {
            setRedirect(true);
        }
    }

    //Redirect to homepage if post was successfully created
    if (redirect) {
        return <Navigate to={'/'}/>
    }

    return (
        //Form for creating a new post
        <form onSubmit={createNewPost}>
            <input type="title" 
                placeholder={'Title'} 
                value={title} 
                onChange={ev => setTitle(ev.target.value)}
            />
            <input type="summary" 
                placeholder={'Summary'} 
                value={summary}
                onChange={ev => setSummary(ev.target.value)}
            />
            <input type="file" 
                onChange={ev => setFiles(ev.target.files)}
            />
            <Editor value={content} onChange={setContent}/>
            <button style ={{marginTop: '5px'}}>Create Post</button>
        </form>
    );
}