import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container flex justify-between items-center py-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          📝 وبلاگ تکنولوژی
        </Link>

        <div className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-blue-600">صفحه اصلی</Link>
          {user ? (
            <>
              <Link to="/create" className="hover:text-blue-600">نوشتن مقاله</Link>
              <Link to={`/profile/${user.username}`} className="hover:text-blue-600">
                {user.username}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-blue-600">پنل مدیریت</Link>
              )}
              <button onClick={handleLogout} className="btn btn-primary">
                خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">ورود</Link>
              <Link to="/register" className="btn btn-primary">ثبت نام</Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-50 py-4 px-4">
          <Link to="/" className="block py-2 hover:text-blue-600">صفحه اصلی</Link>
          {user ? (
            <>
              <Link to="/create" className="block py-2 hover:text-blue-600">نوشتن مقاله</Link>
              <Link to={`/profile/${user.username}`} className="block py-2 hover:text-blue-600">
                {user.username}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="block py-2 hover:text-blue-600">پنل مدیریت</Link>
              )}
              <button onClick={handleLogout} className="block w-full btn btn-primary mt-2">
                خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 hover:text-blue-600">ورود</Link>
              <Link to="/register" className="block btn btn-primary mt-2">ثبت نام</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
