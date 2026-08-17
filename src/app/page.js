"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  LayoutDashboard,
  Users,
  Shield,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">

      {/* ================= NAVBAR ================= */}

      <nav className="relative z-30 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl">

        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold"
        >
          <span className="text-white">Task</span>
          <span className="text-purple-500">Board</span>
        </motion.h1>

        <div className="hidden md:flex items-center gap-8 text-gray-300">

          <a
            href="#features"
            className="hover:text-purple-400 transition"
          >
            Features
          </a>

          <a
            href="/auth/login"
            className="hover:text-purple-400 transition"
          >
            Login
          </a>

          <a
            href="/auth/register"
            className="
              bg-purple-600
              hover:bg-purple-700
              px-5 py-2.5
              rounded-lg
              transition
              shadow-lg shadow-purple-600/30
            "
          >
            Register
          </a>

        </div>
      </nav>


      {/* ================= HERO ================= */}

      <section className="relative min-h-[calc(100vh-80px)] flex items-center">

        {/* ===== TECH BACKGROUND ===== */}

        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_75%_50%,rgba(124,58,237,0.20),transparent_35%),
            radial-gradient(circle_at_15%_70%,rgba(37,99,235,0.14),transparent_30%),
            linear-gradient(135deg,#020617,#030712_55%,#080316)]
          "
        />

        {/* Grid */}

        <div
          className="
            absolute inset-0
            opacity-[0.10]
            [background-image:linear-gradient(rgba(139,92,246,0.4)_1px,transparent_1px),
            linear-gradient(90deg,rgba(139,92,246,0.4)_1px,transparent_1px)]
            [background-size:70px_70px]
          "
        />

        {/* Purple Glow */}

        <div
          className="
            absolute
            -left-40
            top-40
            w-[500px]
            h-[500px]
            rounded-full
            bg-purple-700/20
            blur-[150px]
          "
        />

        {/* Blue Glow */}

        <div
          className="
            absolute
            -right-40
            top-20
            w-[500px]
            h-[500px]
            rounded-full
            bg-blue-600/15
            blur-[160px]
          "
        />


        {/* ================= HERO CONTENT ================= */}

        <div
          className="
            relative z-10
            max-w-7xl
            mx-auto
            w-full
            px-6 md:px-10
            py-20
          "
        >

          {/* MAIN FLEX */}

          <div
            className="
              flex
              flex-col
              lg:flex-row
              items-center
              gap-12
              lg:gap-16
            "
          >

            {/* ================= LEFT CONTENT ================= */}

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="
                w-full
                lg:w-[40%]
                text-center
                lg:text-left
                space-x-8
                flex
                flex-col
                items-center
                justify-center
              "
            >

              {/* Badge */}

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4 py-2
                  rounded-full
                  border
                  border-purple-500/30
                  bg-purple-500/10
                  text-purple-300
                  text-sm
                  mb-7
                "
              >
                <CheckCircle size={16} />

                Smart. Simple. Powerful.
              </div>


              {/* Heading */}

              <h2
                className="
                  text-5xl
                  md:text-6xl
                  xl:text-7xl
                  font-bold
                  leading-[1.05]
                "
              >

                Manage Tasks

                <br />

                <span
                  className="
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-r
                    from-purple-400
                    via-purple-500
                    to-blue-400
                  "
                >
                  Smarter.
                </span>

                <br />

                Work Faster.

              </h2>


              {/* Description */}

              <p
                className="
                  mt-6
                  text-gray-400
                  text-lg
                  leading-relaxed
                  max-w-xl
                  mx-auto
                  lg:mx-0
                "
              >
                A modern full-stack task management system
                designed for teams, employees and administrators.
                Manage tasks, track progress and keep your
                workflow organized.
              </p>


              {/* Buttons */}

              <div
                className="
                  flex
                  flex-wrap
                  justify-center
                  lg:justify-start
                  gap-4
                  mt-8
                "
              >

                <motion.a
                  href="/auth/login"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="
                    flex
                    items-center
                    gap-2
                    bg-purple-600
                    hover:bg-purple-700
                    px-7 py-3.5
                    rounded-xl
                    font-medium
                    shadow-xl
                    shadow-purple-600/30
                    transition
                  "
                >
                  Get Started

                  <ArrowRight size={20} />
                </motion.a>


                <a
                  href="#features"
                  className="
                    px-7 py-3.5
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    backdrop-blur
                    hover:bg-white/10
                    transition
                  "
                >
                  Explore Features
                </a>

              </div>

            </motion.div>


            {/* ================= RIGHT SCREENSHOT ================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: 60,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.9,
                delay: 0.2,
              }}
              className="
                relative
                w-full
                lg:w-[100%]
              "
            >

              {/* Glow behind dashboard */}

              <div
                className="
                  absolute
                  inset-0
                  bg-purple-600/25
                  blur-[100px]
                  scale-75
                "
              />


              {/* Dashboard */}

              <div
                className="
                  relative
                  rounded-2xl
                  border
                  border-purple-500/30
                  bg-[#0b1120]
                  p-2
                  shadow-[0_0_80px_rgba(124,58,237,0.30)]
                  transform
                  rotate-[-2deg]
                  hover:rotate-0
                  transition-transform
                  duration-500
                "
              >

                <img
                  src="/images/TaskBoard.png"
                  alt="TaskBoard Dashboard"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                  "
                />

              </div>


              {/* Bottom Glow */}

              <div
                className="
                  absolute
                  -bottom-5
                  left-1/2
                  -translate-x-1/2
                  w-2/3
                  h-1
                  bg-gradient-to-r
                  from-transparent
                  via-purple-500
                  to-transparent
                  blur-sm

                "
              />

            </motion.div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section
        id="features"
        className="
          relative
          py-24
          px-6
          bg-[#020617]
          border-t
          border-white/5
        "
      >

        <div
          className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2
            w-[500px]
            h-[250px]
            bg-purple-600/10
            blur-[120px]
          "
        />

        <div className="relative max-w-6xl mx-auto">

          <h3
            className="
              text-4xl
              md:text-5xl
              font-bold
              text-center
            "
          >
            Powerful Features
          </h3>

          <p className="text-gray-400 text-center mt-4">
            Everything you need to manage your team's workflow.
          </p>


          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
              mt-14
            "
          >

            <FeatureCard
              icon={<LayoutDashboard size={30} />}
              title="Admin Dashboard"
              description="Complete control over employees, tasks and workflow management."
            />

            <FeatureCard
              icon={<Users size={30} />}
              title="Employee Workspace"
              description="A personalized workspace for employees to manage their assigned tasks."
            />

            <FeatureCard
              icon={<Shield size={30} />}
              title="Secure Authentication"
              description="Role-based access, protected routes and secure authentication."
            />

          </div>

        </div>

      </section>

    </div>
  );
}


/* ================= FEATURE CARD ================= */

function FeatureCard({ icon, title, description }) {

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{
        type: "spring",
        stiffness: 200,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        backdrop-blur-xl
        p-7
        hover:border-purple-500/40
        transition
      "
    >

      <div
        className="
          absolute
          -top-20
          -right-20
          w-40
          h-40
          rounded-full
          bg-purple-600/20
          blur-3xl
          group-hover:bg-purple-600/30
          transition
        "
      />

      <div className="relative">

        <div
          className="
            w-14
            h-14
            rounded-xl
            flex
            items-center
            justify-center
            bg-purple-600/10
            border
            border-purple-500/20
            text-purple-400
            mb-6
          "
        >
          {icon}
        </div>

        <h4 className="text-xl font-bold mb-3">
          {title}
        </h4>

        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>

      </div>

    </motion.div>
  );
}