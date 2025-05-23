import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost(){
    const {id} = useParams(); //Get post ID from URL parameters
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    
    //Fetch existing post data when component mounts
    useEffect(() => {
        fetch('http://localhost:4000/post/'+id)
            .then(response => {
                response.json().then(postInfo => {
                    setTitle(postInfo.title);
                    setContent(postInfo.content);
                    setSummary(postInfo.summary);
                });
            });
    }, [])

    //Handler to update the post on form submission
    async function updatePost(ev){
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id); //Include post ID to identify which post to update
        
        if (files?.[0]){
            data.set('file', files?.[0]); //Add file only if user selected one
        }

        //Send PUT request to update the post
        const respsonse = await fetch('http://localhost:4000/post', {
            method: 'PUT',
            body: data,
            credentials: 'include',
        })

        //If update successful, redirect to the post's detail page
        if (respsonse.ok){
            setRedirect(true);            
        } 
    }
    
    //Redirect to the post detail page after successful update
    if (redirect) {
        return <Navigate to={'/post/'+id}/>
    }

    return (
        <form onSubmit={updatePost}>
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
            <Editor onChange={setContent} value={content}/>
            <button style ={{marginTop: '5px'}}>Update Post</button>
        </form>
    );
}