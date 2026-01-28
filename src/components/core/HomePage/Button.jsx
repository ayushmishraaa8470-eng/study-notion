import React from "react"
import { Link } from "react-router-dom"

const Button = ({ children, active = false, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`
          group relative inline-flex items-center justify-center
          rounded-xl px-8 py-3 font-semibold
          transition-all duration-300
          ${
            active
              ? "text-black"
              : "text-white"
          }
        `}
      >
        {/* 🔥 Glow layer */}
        <span
          className={`
            absolute inset-0 rounded-xl
            bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600
            opacity-0 blur-xl
            transition-all duration-300
            group-hover:opacity-70
          `}
        ></span>

        {/* 🔥 Button surface */}
        <span
          className={`
            relative z-10 rounded-xl px-8 py-3
            transition-all duration-300
            ${
              active
                ? "bg-yellow-50"
                : "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"
            }
            group-hover:scale-105
          `}
        >
          {children}
        </span>
      </div>
    </Link>
  )
}

export default Button
