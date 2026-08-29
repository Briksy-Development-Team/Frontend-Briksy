import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const navItems = [
  { label: 'Overview', to: '/account/profile' },
  { label: 'Liked Properties', to: '/account/liked-properties' },
  { label: 'My Inquiries', to: '/account/inquiries' },
]

const AccountLayout = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#f8f4ee] px-4 pb-16 pt-24 font-helvetica sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row">
        <aside className="lg:sticky lg:top-28 lg:h-fit lg:w-72">
          <div className="rounded-[1.5rem] border border-[#e7e1d8] bg-white p-5 shadow-[0_18px_50px_rgba(52,37,17,0.08)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8b6f54]">Account</p>
            <h1 className="mt-2 text-2xl font-medium text-[#342511]">{user?.name ?? 'Your account'}</h1>
            <p className="mt-2 text-sm text-[#7c5f42]">{user?.email ?? 'Manage your seeker profile, liked properties and enquiries.'}</p>

            <nav className="mt-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-colors',
                      isActive
                        ? 'border-[#342511] bg-[#342511] text-[#eeece0]'
                        : 'border-[#ede8e4] bg-[#fbfaf3] text-[#342511] hover:border-[#342511]',
                    ].join(' ')
                  }
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true">›</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AccountLayout
