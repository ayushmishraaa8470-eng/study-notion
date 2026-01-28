import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropDown"
import ProgressBar from "./progressbar"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)

  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res?.data?.data || [])
      } catch (error) {
        console.log("Could not fetch Categories", error)
      }
      setLoading(false)
    }
    fetchCategories()
  }, [])

  const matchRoute = (route) => location.pathname === route

  return (
    <div className="sticky top-0 z-[1000]">
      <div className="flex items-center justify-center bg-black border-richblack-800">
        <div className="flex w-full max-w-maxContent items-center justify-between px-4 py-2">
          
          {/* LOGO */}
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <img src={logo} alt="Logo" width={170} height={32} />
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            className="block md:hidden text-2xl text-richblack-25"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? "✖" : <AiOutlineMenu />}
          </button>

          {/* NAV LINKS */}
          <nav className={`${mobileMenuOpen ? "block" : "hidden"} md:block`}>
            <ul className="flex flex-col md:flex-row gap-y-4 md:gap-y-0 md:gap-x-14">

              {NavbarLinks.map(({ title, path }, index) => (
                <li key={index} className="relative">

                  {/* 🔥 CATALOG */}
                  {title === "Catalog" ? (
                    <div className="relative">
                      <button
                        onClick={() => setCatalogOpen((prev) => !prev)}
                        className="flex items-center gap-1 text-richblack-25 hover:text-yellow-25"
                      >
                        Catalog <BsChevronDown />
                      </button>

                      {catalogOpen && (
                        <div className="absolute left-0 top-full z-[9999] mt-2 w-[220px] rounded-lg bg-richblack-5 shadow-lg">
                          
                          {loading ? (
                            <p className="p-4 text-center">Loading...</p>
                          ) : subLinks.length > 0 ? (
                            subLinks
                              .filter((cat) => cat?.courses?.length > 0)
                              .map((cat) => (
                                <Link
                                  key={cat._id}
                                  to={`/catalog/${cat.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  onClick={() => {
                                    setCatalogOpen(false)
                                    setMobileMenuOpen(false)
                                  }}
                                  className="block px-4 py-3 text-richblack-900 hover:bg-richblack-200"
                                >
                                  {cat.name}
                                </Link>
                              ))
                          ) : (
                            <p className="p-4 text-center">No Courses Found</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${
                        matchRoute(path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      } hover:text-yellow-25`}
                    >
                      {title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-x-8">
            {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
              <Link to="/dashboard/cart" className="relative">
                <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                {totalItems > 0 && (
                  <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-richblack-600 text-xs font-bold text-yellow-500">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {!token && (
              <>
                <Link to="/login">
                  <button className="rounded-md bg-yellow-50 px-4 py-2 font-semibold text-black">
                    Log In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white">
                    Sign Up
                  </button>
                </Link>
              </>
            )}

            {token && <ProfileDropdown />}
          </div>
        </div>
      </div>

      <ProgressBar />
    </div>
  )
}

export default Navbar
