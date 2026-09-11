import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuthStore } from '../store/authStore'

function CreatePost() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'فناوری',
    tags: '',
    image: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    navigate('/login')
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      }

      const response = await api.post('/posts', postData)
      navigate(`/post/${response.data.slug}`)
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ایجاد مقاله')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['فناوری', 'برنامه‌نویسی', 'هوش‌مصنوعی', 'وب', 'موبایل', 'ابزار', 'دیگر']

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">نوشتن مقاله جدید</h1>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">عنوان</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">توضیح مختصر</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">محتوا</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="12"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600 font-mono text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">دسته‌بندی</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">برچسب‌ها</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="تفکیک با کاما"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">آدرس تصویر</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary"
          >
            {loading ? 'در حال انتشار...' : 'انتشار مقاله'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
