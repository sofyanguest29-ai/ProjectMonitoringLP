'use client'
import { useState, useMemo } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns'
import { id } from 'date-fns/locale'
import { STATUS_OPTIONS } from './ProjectForm'

function statusLabel(value) {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value
}

export default function CalendarView({ projects }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const projectsByDate = useMemo(() => {
    const map = {}
    for (const p of projects) {
      const key = p.deadline
      if (!map[key]) map[key] = []
      map[key].push(p)
    }
    return map
  }, [projects])

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>&larr;</button>
        <h2>{format(currentMonth, 'MMMM yyyy', { locale: id })}</h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>&rarr;</button>
      </div>
      <div className="calendar-grid calendar-weekdays">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((d) => (
          <div key={d} className="weekday">
            {d}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const dayProjects = projectsByDate[key] ?? []
          return (
            <div
              key={key}
              className={`calendar-cell ${isSameMonth(day, currentMonth) ? '' : 'outside-month'} ${
                isSameDay(day, new Date()) ? 'today' : ''
              }`}
            >
              <div className="cell-date">{format(day, 'd')}</div>
              {dayProjects.map((p) => (
                <div key={p.id} className={`cell-event badge-${p.status}`} title={statusLabel(p.status)}>
                  {p.name}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
