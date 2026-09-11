import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

function UserProfile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/profile/${username}`)
      setProfile(response.data)
    } catch (error) {
      console.error('خطا در دریافت پروفایل:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container py-12 text-center">در حال بارگذاری...</div>
  if (!profile) return <div className="container py-12 text-center">پروفایل یافت نشد</div>

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto card">
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt={profile.fullName}
            className="w-32 h-32 rounded-full mx-auto mb-4"
          />
        )}
        <h1 className="text-3xl font-bold text-center mb-2">{profile.fullName}</h1>
        <p className="text-center text-gray-600 mb-4">@{profile.username}</p>
        {profile.bio && <p className="text-center text-gray-700 mb-4">{profile.bio}</p>}
        <div className="flex justify-center gap-4">
          <span className="text-sm text-gray-600">
            نقش: <span className="font-bold">{profile.role}</span>
          </span>
          <span className="text-sm text-gray-600">
            عضویت: {new Date(profile.createdAt).toLocaleDateString('fa-IR')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
