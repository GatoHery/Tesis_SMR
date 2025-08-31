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
  