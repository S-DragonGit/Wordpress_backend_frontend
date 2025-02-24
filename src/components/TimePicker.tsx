"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface TimePickerProps {
  value?: string | null // "HH:MM" format
  onChange?: (time: string) => void // "HH:MM" format
  className?: string
  disabled?: boolean
}

export function TimePicker({ value, onChange, disabled, className = "" }: TimePickerProps) {
  const [hours, setHours] = useState(12)
  const [minutes, setMinutes] = useState(0)
  const [period, setPeriod] = useState<"AM" | "PM">("AM")

  const hoursRef = useRef<HTMLDivElement>(null)
  const minutesRef = useRef<HTMLDivElement>(null)
  const periodRef = useRef<HTMLDivElement>(null)

  const parseTime = useCallback((timeString: string): [number, number] => {
    const [h, m] = timeString.split(":").map(Number)
    return [h || 0, m || 0]
  }, [])

  const formatTime = useCallback((h: number, m: number): string => {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
  }, [])

  const updateTime = useCallback(
    (h: number, m: number, p: "AM" | "PM") => {
      let hour24 = h
      if (p === "PM" && h !== 12) hour24 += 12
      if (p === "AM" && h === 0) hour24 = 0
      const newTime = formatTime(hour24, m)
      onChange?.(newTime)
    },
    [onChange, formatTime],
  )

  useEffect(() => {
    if (value) {
      const [h, m] = parseTime(value)
      const hour12 = h % 12
      setHours(hour12)
      setMinutes(m)
      setPeriod(h >= 12 ? "PM" : "AM")
    } else {
      setHours(0)
      setMinutes(0)
      setPeriod("AM")
      updateTime(0, 0, "AM")
    }
  }, [value, updateTime, parseTime])

  const handleScroll = useCallback(
    (event: WheelEvent, type: "hours" | "minutes" | "period") => {
      event.preventDefault()
      const delta = event.deltaY > 0 ? -1 : 1

      if (type === "hours") {
        setHours((prev) => {
          const newHours = ((prev + delta - 1 + 12) % 12) + 1
          updateTime(newHours, minutes, period)
          return newHours
        })
      } else if (type === "minutes") {
        setMinutes((prev) => {
          const newMinutes = (prev + delta + 60) % 60
          updateTime(hours, newMinutes, period)
          return newMinutes
        })
      } else if (type === "period") {
        setPeriod((prev) => {
          const newPeriod = prev === "AM" ? "PM" : "AM"
          updateTime(hours, minutes, newPeriod)
          return newPeriod
        })
      }
    },
    [hours, minutes, period, updateTime],
  )

  useEffect(() => {
    const elements = [
      { el: hoursRef.current, type: "hours" },
      { el: minutesRef.current, type: "minutes" },
      { el: periodRef.current, type: "period" },
    ] as const

    const handlers = elements.map(({ el, type }) => ({
      el,
      handler: (e: WheelEvent) => disabled === true ? {} : handleScroll(e, type),
    }))

    handlers.forEach(({ el, handler }) => {disabled === true ? {} : 
      el?.addEventListener("wheel", handler, { passive: false })
    })

    return () => {
      disabled === true ? {} : 
      handlers.forEach(({ el, handler }) => {
        el?.removeEventListener("wheel", handler)
      })
    }
  }, [handleScroll])

  return (
    <div className={`flex items-center p-2 gap-2 border border-gray-border ${className}`}>
      <div ref={hoursRef} className="w-1/2 flex flex-col items-center">
      <div className="text-center text-xl font-medium">
          {hours.toString().padStart(2, "0")}
        </div>
        <span className="border-t text-[10px]" style={{color: "gray"}}>Hours</span>
      </div>
      <div ref={minutesRef} className="w-1/2 flex flex-col items-center">
        <div className="text-center text-xl font-medium">
          {minutes.toString().padStart(2, "0")}
        </div>
        <span className="border-t text-[10px]" style={{color: "gray"}}>Minutes</span>
      </div>
      <div ref={periodRef} className="flex flex-col items-center">
        <div className="border-b border-gray-300 pb-2 text-center text-2xl font-light text-gray-800">{period}</div>
      </div>
    </div>
  )
}




// "use client"

// import { useCallback, useEffect, useRef, useState } from "react"

// interface TimePickerProps {
//   value?: Date
//   onChange?: (date: Date) => void
//   className?: string
// }

// export function TimePicker({ value, onChange, className = "" }: TimePickerProps) {
//   const [hours, setHours] = useState(12)
//   const [minutes, setMinutes] = useState(0)
//   const [period, setPeriod] = useState<"AM" | "PM">("AM")

//   const hoursRef = useRef<HTMLDivElement>(null)
//   const minutesRef = useRef<HTMLDivElement>(null)
//   const periodRef = useRef<HTMLDivElement>(null)

//   const updateTime = useCallback(
//     (h: number, m: number, p: "AM" | "PM") => {
//       const newDate = new Date()
//       newDate.setHours(p === "PM" && h !== 12 ? h + 12 : h === 12 && p === "AM" ? 0 : h)
//       newDate.setMinutes(m)
//       newDate.setSeconds(0)
//       newDate.setMilliseconds(0)
//       onChange?.(newDate)
//     },
//     [onChange],
//   )

//   useEffect(() => {
//     if (value) {
//       const h = value.getHours()
//       setHours(h % 12 || 12)
//       setMinutes(value.getMinutes())
//       setPeriod(h >= 12 ? "PM" : "AM")
//     } else {
//       updateTime(12, 0, "AM")
//     }
//   }, [value, updateTime])

//   const handleScroll = useCallback(
//     (event: WheelEvent, type: "hours" | "minutes" | "period") => {
//       event.preventDefault()
//       const delta = event.deltaY > 0 ? -1 : 1

//       if (type === "hours") {
//         setHours((prev) => {
//           const newHours = ((prev + delta - 1 + 12) % 12) + 1
//           updateTime(newHours, minutes, period)
//           return newHours
//         })
//       } else if (type === "minutes") {
//         setMinutes((prev) => {
//           const newMinutes = (prev + delta + 60) % 60
//           updateTime(hours, newMinutes, period)
//           return newMinutes
//         })
//       } else if (type === "period") {
//         setPeriod((prev) => {
//           const newPeriod = prev === "AM" ? "PM" : "AM"
//           updateTime(hours, minutes, newPeriod)
//           return newPeriod
//         })
//       }
//     },
//     [hours, minutes, period, updateTime],
//   )

//   useEffect(() => {
//     const elements = [
//       { el: hoursRef.current, type: "hours" },
//       { el: minutesRef.current, type: "minutes" },
//       { el: periodRef.current, type: "period" },
//     ] as const

//     const handlers = elements.map(({ el, type }) => ({
//       el,
//       handler: (e: WheelEvent) => handleScroll(e, type),
//     }))

//     handlers.forEach(({ el, handler }) => {
//       el?.addEventListener("wheel", handler, { passive: false })
//     })

//     return () => {
//       handlers.forEach(({ el, handler }) => {
//         el?.removeEventListener("wheel", handler)
//       })
//     }
//   }, [handleScroll])

//   return (
//     <div className={`flex items-center p-2 gap-2 border border-gray-border ${className}`}>
//       <div ref={hoursRef} className="w-1/2 flex flex-col items-center">
//         <div className="text-center text-xl font-medium">
//           {hours.toString().padStart(2, "0")}
//         </div>
//         <span className="border-t text-[10px]" style={{color: "gray"}}>Hours</span>
//       </div>
//       <div ref={minutesRef} className="w-1/2 flex flex-col items-center">
//         <div className="text-center text-xl font-medium">
//           {minutes.toString().padStart(2, "0")}
//         </div>
//         <span className="border-t text-[10px]" style={{color: "gray"}}>Minutes</span>
//       </div>
//       <div ref={periodRef} className="flex items-center">
//         <div className="pb-2 text-center text-4xl font-light text-gray-800">{period}</div>
//       </div>
//     </div>
//   )
// }

