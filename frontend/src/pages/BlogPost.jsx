import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { useAuthStore } from '../store/authStore'
import { formatDate } from '../utils/date'
import Comments from '../components/Comments'

function BlogPost() {
  const { slug } = useParams()
  const { user } = useAuthStore()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${slug}`)
      setPost(response.data)
    } catch (error) {
      console.error('خطا در دریافت مقاله:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container py-12 text-center">در حال بارگذاری...</div>
  }

  if (!post) {
    return <div className="container py-12 text-center">مقاله یافت نشد</div>
  }

  return (
    <div className="container py-8">
      <article className="max-w-3xl mx-auto">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 rounded-lg object-cover mb-6"
          />
        )}

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex justify-between items-center mb-6 text-gray-600 pb-6 border-b">
          <div className="flex items-center gap-4">
            {post.author?.avatar && (
              <img
                src={post.author.avatar}
                alt={post.author.fullName}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="font-semibold">{post.author?.fullName}</p>
              <p className="text-sm">@{post.author?.username}</p>
            </div>
          </div>
          <div className="text-sm">
            <p>{formatDate(post.createdAt)}</p>
            <p>👁️ {post.views} بازدید</p>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          {post.content}
        </div>

        <div className="flex gap-2 mb-8">
          {post.tags?.map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {user && <Comments postId={post._id} />}
      </article>
    </div>
  )
}

export default BlogPost
