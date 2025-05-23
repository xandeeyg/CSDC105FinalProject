import { useEffect, useState } from "react";
import Post from "../Post";

export default function IndexPage() {
    const [posts, setPosts] = useState([]);

    //Fetch posts once when component mounts
    useEffect(() => {
        //Fetch all posts from the backend API
        fetch('http://localhost:4000/post').then(response => {
            //Parse the JSON response and update the posts state
            response.json().then(posts => {
                setPosts(posts);
            });
        });
    }, []);
    return (
        <>
            {posts.length > 0 && posts.map(post => (
                <Post {...post} />
            ))}
        </>
    );
}