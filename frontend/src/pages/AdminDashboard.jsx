import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'

function AdminDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('comments')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // دریافت نظرات در انتظار تأیید
      const response = await api.get('/comments')
      setComments(response.data.filter(c => !c.approved))
    } catch (error) {
      console.error('خطا در دریافت داده‌ها:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveComment = async (commentId) => {
    try {
      await api.put(`/comments/${commentId}/approve`)
      setComments(comments.filter(c => c._id !== commentId))
    } catch (error) {
      console.error('خطا در تأیید نظر:', error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`)
      setComments(comments.filter(c => c._id !== commentId))
    } catch (error) {
      console.error('خطا در حذف نظر:', error)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">پنل مدیریت</h1>

      <div className="tabs flex gap-4 border-b mb-8">
        <button
          onClick={() => setActiveTab('comments')}
          className={`px-4 py-2 font-bold border-b-2 transition ${
            activeTab === 'comments'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600'
          }`}
        >
          نظرات در انتظار تأیید ({comments.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">در حال بارگذ��ری...</div>
      ) : (
        <div>
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">نظری در انتظار تأیید نیست</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="card">
                    <div className="mb-4">
                      <p className="font-bold text-lg">{comment.author?.fullName}</p>
                      <p className="text-gray-500 text-sm">@{comment.author?.username}</p>
                    </div>
                    <p className="text-gray-700 mb-4">{comment.content}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveComment(comment._id)}
                        className="btn btn-primary"
                      >
                        تأیید
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="btn bg-red-600 text-white hover:bg-red-700"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
