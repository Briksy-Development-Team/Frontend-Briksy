import { Menu, Heart, HelpCircle, LogOut, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Place from '../../assets/place holder/place.svg'
import Notification from '../../assets/icons/profile/notification.svg'
import { useAuth } from '../../auth/AuthContext'

const ProfileDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (document.body.style.position === 'fixed') return

      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const handleLogout = async (): Promise<void> => {
    setDropdownOpen(false)
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((value) => !value)}
        className="flex items-center justify-center gap-2 rounded-3xl border border-white/20 bg-white px-3 py-2 text-gray-800 transition-colors"
        aria-label="Open account menu"
      >
        <Menu size={20} />
        <span className="hidden text-sm font-medium lg:inline">{user?.name?.split(' ')[0] ?? 'Account'}</span>
        <img loading="lazy" src={Place} alt="profile" className="h-6 w-6" />
      </button>

      {dropdownOpen ? (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-[#e7e1d8] bg-white shadow-xl">
          <div className="border-b border-[#f0ebe5] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8b6f54]">Signed in as</p>
            <p className="mt-1 text-sm font-medium text-[#342511]">{user?.name ?? 'Seeker'}</p>
            <p className="text-sm text-[#7c5f42]">{user?.email}</p>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                setDropdownOpen(false)
                navigate('/account/profile')
              }}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-[#342511] hover:bg-[#fbfaf3]"
            >
              <UserRound size={18} className="text-[#8b6f54]" />
              My Account
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false)
                navigate('/account/liked-properties')
              }}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-[#342511] hover:bg-[#fbfaf3]"
            >
              <Heart size={18} className="text-[#8b6f54]" />
              My Liked Properties
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false)
                navigate('/account/inquiries')
              }}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-[#342511] hover:bg-[#fbfaf3]"
            >
              <img src={Notification} alt="" className="h-[18px] w-[18px]" />
              My Inquiries
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false)
                navigate('/help-support')
              }}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-[#342511] hover:bg-[#fbfaf3]"
            >
              <HelpCircle size={18} className="text-[#8b6f54]" />
              Help & Contact
            </button>
          </div>

          <div className="border-t border-[#f0ebe5] p-2">
            <button
              onClick={() => void handleLogout()}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#d4573d] hover:bg-[#fff6f3]"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ProfileDropdown
