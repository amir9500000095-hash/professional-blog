import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuthStore } from '../store/authStore'
import { formatDate } from '../utils/date'

function Comments({ postId }) {
  const { user } = useAuthStore()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/post/${postId}`)
      setComments(response.data)
    } catch (error) {
      console.error('خطا در دریافت نظرات:', error)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const response = await api.post('/comments', {
        content: newComment,
        postId
      })
      setComments([response.data, ...comments])
      setNewComment('')
    } catch (error) {
      console.error('خطا در ارسال نظر:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">نظرات</h2>

      {user && (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="نظر خود را بنویسید..."
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary mt-2"
          >
            {loading ? 'در حال ارسال...' : 'ارسال نظر'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">نظری ثبت نشده است</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold">{comment.author?.fullName}</p>
                  <p className="text-gray-500 text-sm">@{comment.author?.username}</p>
                </div>
                <p className="text-gray-500 text-sm">{formatDate(comment.createdAt)}</p>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Comments
