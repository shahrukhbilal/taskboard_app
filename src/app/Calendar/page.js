"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const today = new Date();

  // 🧠 State
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [direction, setDirection] = useState(0);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Calculate first weekday and total days
  const firstDay = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  const totalDays = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  // 🔄 Change month
  const changeMonth = (dir) => {
    setDirection(dir);

    if (dir === -1) {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }

    // Reset selected date when changing month
    setSelectedDate(null);
  };

  // 🎨 Month slide animation
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),

    center: {
      x: 0,
      opacity: 1,
    },

    exit: (dir) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  // 🎉 Weekday animation
  const stagger = {
    hidden: {
      opacity: 0,
      y: 10,
    },

    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
      },
    }),
  };

  return (
    <div
      className="
        min-h-screen
        p-4 sm:p-8
        bg-gray-50 dark:bg-gray-950
        text-gray-800 dark:text-gray-100
      "
    >
      {/* =========================
          Page Header
      ========================== */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 sm:mb-8 text-center"
      >
        <h1
          className="
            text-2xl sm:text-3xl
            font-semibold
            text-gray-800 dark:text-gray-100
          "
        >
          Calendar
        </h1>

        <p
          className="
            mt-1
            text-sm sm:text-base
            text-gray-500 dark:text-gray-400
          "
        >
          View and select dates
        </p>
      </motion.div>

      {/* =========================
          Calendar Card
      ========================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          w-full
          max-w-sm sm:max-w-xl
          mx-auto

          bg-white dark:bg-gray-900

          border
          border-gray-200 dark:border-gray-800

          shadow-sm

          rounded-2xl

          p-4 sm:p-6
        "
      >
        {/* =========================
            Month Navigation
        ========================== */}
        <div
          className="
            flex
            items-center
            justify-between
            mb-5 sm:mb-6
          "
        >
          {/* Previous */}
          <motion.button
            whileHover={{
              scale: 1.08,
              backgroundColor: "rgba(156, 163, 175, 0.15)",
            }}
            whileTap={{
              scale: 0.92,
            }}
            onClick={() => changeMonth(-1)}
            className="
              p-2
              rounded-xl

              text-gray-600
              dark:text-gray-300

              hover:bg-gray-100
              dark:hover:bg-gray-800

              transition-colors
            "
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </motion.button>

          {/* Current Month */}
          <motion.h2
            key={`${currentMonth}-${currentYear}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="
              text-lg sm:text-xl
              font-semibold
              text-gray-800 dark:text-gray-100
            "
          >
            {months[currentMonth]} {currentYear}
          </motion.h2>

          {/* Next */}
          <motion.button
            whileHover={{
              scale: 1.08,
              backgroundColor: "rgba(156, 163, 175, 0.15)",
            }}
            whileTap={{
              scale: 0.92,
            }}
            onClick={() => changeMonth(1)}
            className="
              p-2
              rounded-xl

              text-gray-600
              dark:text-gray-300

              hover:bg-gray-100
              dark:hover:bg-gray-800

              transition-colors
            "
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* =========================
            Weekday Labels
        ========================== */}
        <div
          className="
            grid grid-cols-7
            text-center
            font-semibold
            text-gray-500 dark:text-gray-400
            mb-2 sm:mb-3
            text-xs sm:text-sm
          "
        >
          {[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ].map((day, i) => (
            <motion.div
              key={day}
              initial="hidden"
              animate="visible"
              variants={stagger}
              custom={i}
              className="py-2"
            >
              {day}
            </motion.div>
          ))}
        </div>

        {/* =========================
            Days
        ========================== */}
        <AnimatePresence
          custom={direction}
          mode="wait"
        >
          <motion.div
            key={`${currentMonth}-${currentYear}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="
              grid
              grid-cols-7
              gap-1.5 sm:gap-2
            "
          >
            {/* Empty slots */}
            {Array.from({ length: firstDay }).map(
              (_, i) => (
                <div key={`empty-${i}`} />
              )
            )}

            {/* Calendar Days */}
            {Array.from(
              { length: totalDays },
              (_, i) => i + 1
            ).map((day) => {
              const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              const isSelected =
                selectedDate === day;

              return (
                <motion.button
                  key={day}
                  onClick={() =>
                    setSelectedDate(day)
                  }
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className={`
                    aspect-square
                    rounded-xl
                    border

                    flex
                    items-center
                    justify-center

                    text-xs sm:text-sm
                    font-medium

                    transition-all
                    duration-200

                    ${
                      isSelected
                        ? `
                          bg-blue-600
                          text-white
                          border-blue-600
                          shadow-md
                        `
                        : isToday
                        ? `
                          bg-blue-50
                          dark:bg-blue-900/30
                          text-blue-700
                          dark:text-blue-400
                          border-blue-200
                          dark:border-blue-800
                          font-semibold
                        `
                        : `
                          bg-white
                          dark:bg-gray-900

                          text-gray-700
                          dark:text-gray-300

                          border-gray-200
                          dark:border-gray-800

                          hover:bg-gray-50
                          dark:hover:bg-gray-800

                          hover:border-gray-300
                          dark:hover:border-gray-700
                        `
                    }
                  `}
                >
                  {day}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* =========================
            Today Indicator
        ========================== */}
        <div
          className="
            mt-5
            pt-4
            border-t
            border-gray-200
            dark:border-gray-800
          "
        >
          <div className="flex items-center justify-center gap-4">

            <div className="flex items-center gap-2">
              <span
                className="
                  w-3 h-3
                  rounded-full
                  bg-blue-50
                  dark:bg-blue-900/30
                  border
                  border-blue-300
                  dark:border-blue-700
                "
              />

              <span
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Today
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="
                  w-3 h-3
                  rounded-full
                  bg-blue-600
                "
              />

              <span
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Selected
              </span>
            </div>

          </div>
        </div>
      </motion.div>

      {/* =========================
          Selected Date
      ========================== */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              mt-4 sm:mt-6
              text-center
            "
          >
            <p
              className="
                text-sm sm:text-base
                text-gray-500
                dark:text-gray-400
              "
            >
              Selected Date
            </p>

            <p
              className="
                mt-1
                text-base sm:text-lg
                font-semibold
                text-blue-600
                dark:text-blue-400
              "
            >
              {months[currentMonth]} {selectedDate},{" "}
              {currentYear}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}