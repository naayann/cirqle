import { Link } from 'react-router'
import { useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi"
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { signInWithGithub, signOut, user } = useAuth()

  const displayName = user?.user_metadata.user_name || user?.email

  return (
    <nav className="w-full fixed top-0 z-50 backdrop-blur-md bg-white/70 border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center justify-between w-full">

            <Link
              to={"/"}
              className="flex items-center gap-1.5 group"
            >
              <span className="relative w-6 h-6 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-black"></span>
                <span className="relative text-white text-xs font-semibold">
                  C
                </span>
              </span>
              <span className="text-lg font-semibold tracking-tighter text-neutral-900 transition group-hover:opacity-80">
                cirqle
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8 text-[15px] text-neutral-600 font-medium">

              <Link to={"/"} className="hover:text-neutral-900 transition">
                Home
              </Link>

              <Link to={"/create"} className="hover:text-neutral-900 transition">
                Create Post
              </Link>

              <Link to={"/communities"} className="hover:text-neutral-900 transition">
                Communities
              </Link>

              <Link to={"/community/create"} className="hover:text-neutral-900 transition">
                Create Community
              </Link>

            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center gap-3 ml-6">

              {user ? (
                <div className="flex items-center gap-3">

                  {user.user_metadata.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt='User Avatar'
                      className="w-8 h-8 rounded-full object-cover border border-neutral-200 hover:border-neutral-400 transition"
                    />
                  )}

                  <span className="text-sm text-neutral-700 max-w-[120px] truncate">
                    {displayName}
                  </span>

                  <button
                    onClick={signOut}
                    className="px-4 py-1 rounded-md bg-red-500 text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.97] font-medium "
                  >
                    Sign Out
                  </button>

                </div>
              ) : (
                <button
                  onClick={signInWithGithub}
                  className="px-4 py-1.5 rounded-md bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm hover:shadow-md hover:from-violet-600 hover:to-indigo-600 transition-all duration-200 active:scale-[0.97]"
                >
                  Sign in with GitHub
                </button>
              )}

            </div>

            {/* Mobile Menu Button*/}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-2 rounded-md text-neutral-700 hover:bg-neutral-100 transition active:scale-95"
              >
                <GiHamburgerMenu className="text-xl" />
              </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
              <div className="absolute top-16 left-0 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">

                <div className="flex flex-col px-6 py-4 space-y-4 text-neutral-700 font-medium">

                  <Link to={"/"} className="hover:text-neutral-900 transition">
                    Home
                  </Link>

                  <Link to={"/create"} className="hover:text-neutral-900 transition">
                    Create Post
                  </Link>

                  <Link to={"/communities"} className="hover:text-neutral-900 transition">
                    Communities
                  </Link>

                  <Link
                    to={"/community/create"}
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-center shadow-sm hover:from-violet-600 hover:to-indigo-600 transition active:scale-[0.97]"
                  >
                    Create Community
                  </Link>

                  {/* Mobile Auth */}
                  <div className="pt-4 border-t border-neutral-200">

                    {user ? (
                      <div className="flex flex-col gap-3">

                        <div className="flex items-center gap-3">
                          {user.user_metadata.avatar_url && (
                            <img
                              src={user.user_metadata.avatar_url}
                              alt="User Avatar"
                              className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                            />
                          )}
                          <span className="text-sm text-neutral-700 truncate">
                            {displayName}
                          </span>
                        </div>

                        <button
                          onClick={signOut}
                          className="text-sm text-neutral-500 hover:text-neutral-900 transition text-left"
                        >
                          Sign Out
                        </button>

                      </div>
                    ) : (
                      <button
                        onClick={signInWithGithub}
                        className="w-full px-4 py-2 rounded-md border border-neutral-300 text-sm text-neutral-700 hover:border-neutral-400 hover:text-neutral-900 transition active:scale-[0.97]"
                      >
                        Sign in with GitHub
                      </button>
                    )}

                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar