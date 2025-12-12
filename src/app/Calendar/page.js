"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [direction, setDirection] = useState(0);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  const changeMonth = (dir) => {
    setDirection(dir);
    if (dir === -1) {
      currentMonth === 0
        ? (setCurrentMonth(11), setCurrentYear(currentYear - 1))
        : setCurrentMonth(currentMonth - 1);
    } else {
      currentMonth === 11
        ? (setCurrentMonth(0), setCurrentYear(currentYear + 1))
        : setCurrentMonth(currentMonth + 1);
    }
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
  };

  const stagger = {
    hidden: { opacity: 0, y: 10 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03 },
    }),
  };

  return (
    <div className="p-4 sm:p-8 bg-blue-100">

      {/* Page Header */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-4xl font-bold text-purple-700 mb-6 sm:mb-8 text-center"
      >
        Calendar
      </motion.h1>

      {/* Responsive Calendar Box */}
      <div className="w-full max-w-sm sm:max-w-xl mx-auto bg-white shadow-2xl rounded-2xl p-4 sm:p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => changeMonth(-1)}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft size={20} />
          </motion.button>

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg sm:text-xl font-semibold"
          >
            {months[currentMonth]} {currentYear}
          </motion.h2>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => changeMonth(1)}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-2 sm:mb-3 text-xs sm:text-base">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day, i) => (
            <motion.div
              key={day}
              initial="hidden"
              animate="visible"
              variants={stagger}
              custom={i}
            >
              {day}
            </motion.div>
          ))}
        </div>

        {/* Days Grid */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentMonth + "-" + currentYear}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="grid grid-cols-7 gap-1 sm:gap-2"
          >
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={i}></div>
            ))}

            {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
              const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();
              const isSelected = selectedDate === day;

              return (
                <motion.button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    p-2 sm:p-3 rounded-xl border text-center font-medium text-xs sm:text-base transition
                    ${isToday ? "bg-green-500 text-white" : ""}
                    ${isSelected ? "bg-purple-600 text-white shadow-lg" : ""}
                  `}
                >
                  {day}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Selected Date */}
      {selectedDate && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 sm:mt-6 text-center text-base sm:text-lg text-gray-700"
        >
          Selected Date:{" "}
          <span className="font-bold text-purple-700">
            {months[currentMonth]} {selectedDate}, {currentYear}
          </span>
        </motion.p>
      )}
    </div>
  );
}
