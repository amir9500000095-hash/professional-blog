import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { formatDate } from '../utils/date'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchPosts()
  }, [category, page])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      params.append('page', page)
      params.append('limit', 10)

      const response = await api.get(`/posts?${params}`)
      setPosts(response.data.posts)
    } catch (error) {
      console.error('خطا در دریافت مقالات:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['فناوری', 'برنامه‌نویسی', 'هوش‌مصنوعی', 'وب', 'موبایل', 'ابزار']

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">وبلاگ تکنولوژی حرفه‌ای</h1>
        <p className="text-gray-600 text-lg">آخرین اخبار و مقالات تکنولوژی</p>
      </div>

      {/* فیلتر دسته‌بندی */}
      <div className="mb-8 flex gap-2 flex-wrap">
        <button
          onClick={() => { setCategory(null); setPage(1); }}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            category === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          همه
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(1); }}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* لیست مقالات */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">مقاله‌ای یافت نشد</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post._id} className="card hover:shadow-lg transition">
              <div className="flex gap-4">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <Link to={`/post/${post.slug}`}>
                    <h2 className="text-2xl font-bold text-blue-600 hover:underline">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 my-2">{post.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>نویسنده: {post.author?.fullName}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">👁️ {post.views} بازدید</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
