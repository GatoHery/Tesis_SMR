export const getTodayStartEnd = () => {
  const now = new Date()

  // Create start date (today 00:00:00)
  const todayStart = new Date(now)
  todayStart.setUTCHours(0, 0, 0, 0)

  // Create end date (today 23:59:59)
  const todayEnd = new Date(now)
  todayEnd.setUTCHours(23, 59, 59, 999)

  // Format as ISO 8601 with GMT-6 offset
  const offset = -6 // GMT-6
  const formatWithOffset = (date: Date) => {
    const localTime = new Date(date.getTime() + offset * 60 * 60 * 1000)
    return localTime.toISOString().replace('.000Z', '-0600')
  }

  return {
    todayStart: formatWithOffset(todayStart),
    todayEnd: formatWithOffset(todayEnd)
  }
}

export const getWeekRange = (date: Date, weekOffset = 0) => {
  // weekOffset = 0 → esta semana, -1 → semana anterior
  const d = new Date(date)
  // mover al lunes de la semana
  const day = d.getDay() // 0=domingo,1=lunes...
  const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diffToMonday + weekOffset * 7)
  d.setHours(0, 0, 0, 0)
  const start = new Date(d)
  const end = new Date(d)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return {
    startISO: start.toISOString(),
    endISO: end.toISOString()
  }
}
