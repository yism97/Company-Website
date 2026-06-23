
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { HiMenu, HiX } from "react-icons/hi"
import axios from "axios"

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout", {}, {
        withCredentials: true
      })
      if(response.status === 200){
        navigate("/admin")
      }
    } catch (error) {
      console.error("로그아웃 실패:", error)
    }
  }
  return (
    <section className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/admin/posts" className="text-2xl font-bold">관리자 페이지</Link>
          </div>
          <div className = "hidden text-lg lg:flex items-center gap-4"> 
            <Link to="/admin/posts" className="hover:text-gray-300">게시글 관리</Link>
            <Link to="/admin/contacts" className="hover:text-gray-300">문의 관리</Link>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Logout</button>
          </div>
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-gray-700">
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="lg:hidden">
            <div className="flex flex-col items-center gap-4 px-2 pt-2 pb-3 ">
              <Link to="/admin/posts" className="block hover:bg-gray-700 px-4 py-2 rounded" onClick={() => setIsOpen(false)}>게시글</Link>
              <Link to="/admin/contacts" className="block hover:bg-gray-700 px-4 py-2 rounded" onClick={() => setIsOpen(false)}>문의 관리</Link>
              <button onClick={handleLogout} className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded">Logout</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminNavbar