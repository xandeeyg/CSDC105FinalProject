import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function DeletePostButton({ postId }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:4000/post/${postId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete post")
      }

      navigate("/")
    } catch (err) {
      setError(err.message)
      setIsDeleting(false)
    }
  }

  return (
    <>
      <button className="delete-btn" onClick={() => setShowModal(true)}>
        Delete Post
      </button>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this post?</p>

            {error && <p className="error">{error}</p>}

            <div className="modal-buttons">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="confirm-btn"
              >
                {isDeleting ? "Deleting..." : "Yes"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
