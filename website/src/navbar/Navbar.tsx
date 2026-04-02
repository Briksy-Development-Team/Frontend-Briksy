import { Sun, Moon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

interface NavbarProps {
    dark: boolean
    setDark: (value: boolean) => void
    avatar?: string
    name?: string
}

const NAV_LINKS = [
    { label: "Explore", path: "/" },
    { label: "My Properties", path: "/properties" },
    { label: "Support", path: "/support" },
]

const Navbar = ({ dark, setDark, avatar, name }: NavbarProps) => {
    const location = useLocation()
    const { isAuthenticated, logout, user } = useAuth()
    const displayName = user?.name ?? name ?? "User"

    return (
        <nav className={`
            sticky top-0 z-50 flex items-center justify-between px-8 h-16
            border-b backdrop-blur-md transition-all duration-300
            ${dark ? "bg-black/80 border-zinc-800" : "bg-white/80 border-zinc-200"}
        `}>

            <Link to="/" className="flex items-center gap-2 no-underline">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${dark ? "bg-white" : "bg-black"}`}>
                    <span className={`text-xs font-black ${dark ? "text-black" : "text-white"}`}>B</span>
                </div>
                <span className={`text-base font-bold tracking-tight ${dark ? "text-white" : "text-black"}`}>
                    Briksy
                </span>
            </Link>

            <div className="flex items-center gap-6">

                {NAV_LINKS.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`
                                text-sm transition-colors duration-200 no-underline font-medium
                                ${isActive
                                    ? dark ? "text-white" : "text-black"
                                    : dark ? "text-zinc-500 hover:text-zinc-200" : "text-zinc-400 hover:text-zinc-700"
                                }
                            `}
                        >
                            {item.label}
                            {isActive && (
                                <span className={`block h-0.5 mt-0.5 rounded-full ${dark ? "bg-white" : "bg-black"}`} />
                            )}
                        </Link>
                    )
                })}

                <button
                    onClick={() => setDark(!dark)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium
                        transition-all duration-300 cursor-pointer
                        ${dark
                            ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-400"
                            : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-500"
                        }
                    `}
                >
                    {dark ? <Sun size={15} /> : <Moon size={15} />}
                    {dark ? "Light" : "Dark"}
                </button>

                {avatar && (
                    <Link to="/profile">
                        <img
                            src={avatar}
                            alt={displayName}
                            className={`
                                w-8 h-8 rounded-full object-cover ring-2 ring-offset-2 cursor-pointer
                                ${dark ? "ring-zinc-700 ring-offset-black" : "ring-zinc-300 ring-offset-white"}
                            `}
                        />
                    </Link>
                )}
<<<<<<< Updated upstream

=======
                {isAuthenticated ? (
                    <button
                        onClick={() => void logout()}
                        className={`py-1 px-3 rounded-4xl border transition-colors ${dark
                            ? "border-zinc-700 text-zinc-200 hover:bg-white hover:text-black"
                            : "border-zinc-300 text-zinc-700 hover:bg-black hover:text-white"
                            }`}
                    >
                        Logout
                    </button>
                ) : (
                    <Link to="/login"
                        className="hover:bg-white hover:text-black py-1 px-3 rounded-4xl">
                        Login
                    </Link>
                )}
>>>>>>> Stashed changes
            </div>
        </nav>
    )
}

export default Navbar
