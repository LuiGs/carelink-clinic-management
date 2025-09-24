'use client'

import React, { useEffect, useMemo, useState } from 'react'
import styles from './agenda.module.css'

type AppointmentStatus = 'PENDING' | 'WAITING' | 'COMPLETED' | 'CANCELED'

type Appointment = {
  id: string
  professionalId: string
  patientId?: string | null
  title: string
  start: string // ISO
  end: string // ISO
  status: AppointmentStatus
  notes?: string | null
}

type View = 'day' | 'week' | 'month'

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: 'Pendiente',
  WAITING: 'En sala de espera',
  COMPLETED: 'Finalizado',
  CANCELED: 'Cancelado',
}

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
function startOfWeek(d: Date) {
  const x = startOfDay(d)
  const day = x.getDay() // 0 Sun ... 6 Sat
  const diff = (day + 6) % 7 // Monday-based week
  x.setDate(x.getDate() - diff)
  return x
}
function endOfWeek(d: Date) {
  const s = startOfWeek(d)
  return addDays(s, 6)
}
function startOfMonth(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth(), 1)
  x.setHours(0, 0, 0, 0)
  return x
}
function endOfMonth(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  x.setHours(23, 59, 59, 999)
  return x
}
function fmtISODate(d: Date) {
  return d.toISOString()
}
function getHoursRange() {
  // Working hours 07:00 - 20:00
  return { startHour: 7, endHour: 20 }
}
function minutesSinceStartOfGrid(date: Date) {
  const { startHour } = getHoursRange()
  return date.getHours() * 60 + date.getMinutes() - startHour * 60
}
function totalGridMinutes() {
  const { startHour, endHour } = getHoursRange()
  return (endHour - startHour) * 60
}

export default function AgendaPage() {
  const [view, setView] = useState<View>('week')
  const [date, setDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const { from, to } = useMemo(() => {
    if (view === 'day') {
      const s = startOfDay(date)
      const e = addDays(s, 1)
      return { from: s, to: e }
    }
    if (view === 'week') {
      return { from: startOfWeek(date), to: addDays(endOfWeek(date), 1) }
    }
    return { from: startOfMonth(date), to: addDays(endOfMonth(date), 1) }
  }, [view, date])

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          from: fmtISODate(from),
          to: fmtISODate(to),
        })
        const res = await fetch(`/api/agenda?${params.toString()}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: Appointment[] = await res.json()
        if (!ignore) setAppointments(data)
      } catch (e) {
        console.error('Agenda fetch error', e)
        if (!ignore) setAppointments([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [from, to])

  const weekDays = useMemo(() => {
    const start = startOfWeek(date)
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [date])

  function goPrev() {
    if (view === 'day') setDate(addDays(date, -1))
    else if (view === 'week') setDate(addDays(date, -7))
    else setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))
  }
  function goNext() {
    if (view === 'day') setDate(addDays(date, 1))
    else if (view === 'week') setDate(addDays(date, 7))
    else setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))
  }
  function goToday() {
    setDate(new Date())
  }

  function byDay(d: Date) {
    const y = d.getFullYear()
    const m = d.getMonth()
    const day = d.getDate()
    return appointments.filter((a) => {
      const s = new Date(a.start)
      return s.getFullYear() === y && s.getMonth() === m && s.getDate() === day
    })
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Agenda</h1>
          <div className="flex gap-2">
            <button onClick={goPrev} className="inline-flex items-center rounded-md border border-emerald-200 bg-white px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50" aria-label="Anterior">‹</button>
            <button onClick={goToday} className="inline-flex items-center rounded-md border border-emerald-200 bg-white px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50">Hoy</button>
            <button onClick={goNext} className="inline-flex items-center rounded-md border border-emerald-200 bg-white px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50" aria-label="Siguiente">›</button>
            <div className="ml-3 inline-flex rounded-lg border border-emerald-200 overflow-hidden">
              <button className={view === 'day' ? styles.viewActiveTail : styles.viewBtnTail} onClick={() => setView('day')}>Día</button>
              <button className={view === 'week' ? styles.viewActiveTail : styles.viewBtnTail} onClick={() => setView('week')}>Semana</button>
              <button className={view === 'month' ? styles.viewActiveTail : styles.viewBtnTail} onClick={() => setView('month')}>Mes</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-6 space-y-4">
        <StatusLegend />

        {loading && <div className="text-sm text-emerald-700">Cargando…</div>}

        {view === 'day' && <DayView date={date} items={byDay(date)} />}
        {view === 'week' && <WeekView days={weekDays} items={appointments} />} 
        {view === 'month' && <MonthView date={date} items={appointments} onSelectDay={setDate} />}
      </main>
    </div>
  )
}

function StatusLegend() {
  return (
    <div className={styles.legend}> 
      {(['PENDING', 'WAITING', 'COMPLETED', 'CANCELED'] as AppointmentStatus[]).map((s) => (
        <div key={s} className={styles.legendItem}>
          <span className={`${styles.badge} ${styles[`status_${s}`]}`} />
          <span>{STATUS_LABELS[s]}</span>
        </div>
      ))}
    </div>
  )
}

function DayView({ date, items }: { date: Date; items: Appointment[] }) {
  const hours = Array.from({ length: getHoursRange().endHour - getHoursRange().startHour + 1 }, (_, i) => getHoursRange().startHour + i)
  const total = totalGridMinutes()
  return (
    <div className={styles.dayGrid} aria-label={`Agenda del ${date.toLocaleDateString()}`}>
      <div className={styles.timeCol}>
        {hours.map((h) => (
          <div key={h} className={styles.timeCell}>
            {String(h).padStart(2, '0')}:00
          </div>
        ))}
      </div>
      <div className={styles.dayCol}>
        <div className={styles.eventsLayer}>
          {items.map((a) => {
            const s = new Date(a.start)
            const e = new Date(a.end)
            const top = Math.max(0, (minutesSinceStartOfGrid(s) / total) * 100)
            const height = Math.max(8, ((e.getTime() - s.getTime()) / 60000 / total) * 100)
            return (
              <div
                key={a.id}
                className={`${styles.event} ${styles[`status_${a.status}`]}`}
                style={{ top: `${top}%`, height: `${height}%` }}
                title={`${a.title} (${STATUS_LABELS[a.status]})`}
              >
                <div className={styles.eventTitle}>{a.title}</div>
                <div className={styles.eventTime}>
                  {s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )
          })}
        </div>
        <div className={styles.hourLines}>
          {hours.map((h) => (
            <div key={h} className={styles.hourLine} />
          ))}
        </div>
      </div>
    </div>
  )
}

function WeekView({ days, items }: { days: Date[]; items: Appointment[] }) {
  const hours = Array.from({ length: getHoursRange().endHour - getHoursRange().startHour + 1 }, (_, i) => getHoursRange().startHour + i)
  const total = totalGridMinutes()

  function itemsForDay(d: Date) {
    return items.filter((a) => {
      const s = new Date(a.start)
      return s.toDateString() === d.toDateString()
    })
  }

  return (
    <div className={styles.weekGrid}>
      <div className={styles.gridHeader}>
        <div className={styles.cornerCell} />
        {days.map((d) => (
          <div key={d.toISOString()} className={styles.headerCell}>
            <div className={styles.headerDayName}>{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
            <div className={styles.headerDayNum}>{d.getDate()}</div>
          </div>
        ))}
      </div>
      <div className={styles.gridBody}>
        <div className={styles.timeCol}>
          {hours.map((h) => (
            <div key={h} className={styles.timeCell}>
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>
        {days.map((d) => (
          <div key={d.toISOString()} className={styles.dayCol}>
            <div className={styles.eventsLayer}>
              {itemsForDay(d).map((a) => {
                const s = new Date(a.start)
                const e = new Date(a.end)
                const top = Math.max(0, (minutesSinceStartOfGrid(s) / total) * 100)
                const height = Math.max(8, ((e.getTime() - s.getTime()) / 60000 / total) * 100)
                return (
                  <div
                    key={a.id}
                    className={`${styles.event} ${styles[`status_${a.status}`]}`}
                    style={{ top: `${top}%`, height: `${height}%` }}
                    title={`${a.title} (${STATUS_LABELS[a.status]})`}
                  >
                    <div className={styles.eventTitle}>{a.title}</div>
                    <div className={styles.eventTime}>
                      {s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={styles.hourLines}>
              {hours.map((h) => (
                <div key={h} className={styles.hourLine} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MonthView({ date, items, onSelectDay }: { date: Date; items: Appointment[]; onSelectDay: (d: Date) => void }) {
  const start = startOfWeek(startOfMonth(date))
  const end = endOfWeek(endOfMonth(date))
  const days: Date[] = []
  {
    const msPerDay = 24 * 60 * 60 * 1000
    const totalDays = Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start.getTime() + i * msPerDay)
      days.push(d)
    }
  }
  function itemsForDay(d: Date) {
    return items.filter((a) => {
      const s = new Date(a.start)
      return s.toDateString() === d.toDateString()
    })
  }
  const currentMonth = date.getMonth()

  return (
    <div className={styles.monthGrid}>
      {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((lbl) => (
        <div key={lbl} className={styles.monthHeaderCell}>
          {lbl}
        </div>
      ))}
      {days.map((d) => (
        <button
          key={d.toISOString()}
          className={`${styles.monthCell} ${d.getMonth() === currentMonth ? '' : styles.monthCellMuted}`}
          onClick={() => onSelectDay(d)}
        >
          <div className={styles.monthCellDate}>{d.getDate()}</div>
          <div className={styles.monthEvents}>
            {itemsForDay(d)
              .slice(0, 3)
              .map((a) => (
                <div key={a.id} className={`${styles.monthEvent} ${styles[`status_${a.status}`]}`}>
                  <span className={styles.monthEventDot} />
                  <span className={styles.ellipsis}>{a.title}</span>
                </div>
              ))}
            {itemsForDay(d).length > 3 && <div className={styles.more}>+{itemsForDay(d).length - 3} más</div>}
          </div>
        </button>
      ))}
    </div>
  )
}
