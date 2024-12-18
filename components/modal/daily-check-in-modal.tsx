'use client'

import {useState} from 'react'
import {Modal} from "@/components/modal/modal"
import {Button} from "@/components/ui/button"
import {ChevronLeft, ChevronRight} from 'lucide-react'

interface DailyCheckInModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
}


interface CalendarDay {
    date: string
    isCheckedIn: boolean
}

interface LeaderboardEntry {
    id: string
    username: string
    avatarUrl: string
    monthlyCheckIns: number
    currentStreak: number
}


const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
const today = new Date()

export function DailyCheckInModal({isOpen, onClose, userId}: DailyCheckInModalProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [calendarData, setCalendarData] = useState<CalendarDay[]>([])
    const [currentStreak, setCurrentStreak] = useState(0)
    const [monthlyCheckIns, setMonthlyCheckIns] = useState(0)
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchCalendarData = async () => {
        setIsLoading(true)
        try {
            // const year = currentDate.getFullYear()
            // const month = currentDate.getMonth() + 1
            // const response = await fetch(`/api/daily-check-in?userId=${userId}&year=${year}&month=${month}`)
            // if (!response.ok) throw new Error('获取打卡记录失败')
            // const data = await response.json()
            // setCalendarData(data.calendarData)
            // setCurrentStreak(data.currentStreak)
            // setMonthlyCheckIns(data.monthlyCheckIns)
        } catch (error) {
            console.error('获取打卡记录失败:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('/api/leaderboard')
            if (!response.ok) throw new Error('获取排行榜失败')
            const data = await response.json()
            setLeaderboard(data)
        } catch (error) {
            console.error('获取排行榜失败:', error)
        }
    }

    const handleCheckIn = async () => {
        setIsLoading(true)
        try {
            // const response = await fetch('/api/daily-check-in', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ userId }),
            // })
            // if (!response.ok) throw new Error('打卡失败')
            // await fetchCalendarData()
            // await fetchLeaderboard()
        } catch (error) {
            console.error('打卡失败:', error)
        } finally {
            setIsLoading(false)
        }
    }
    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1)
        if (newDate <= today) {
            setCurrentDate(newDate)
        }
    }

    const renderCalendar = () => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const calendarDays = []
        for (let i = 0; i < 42; i++) {
            const dayNumber = i - firstDay + 1
            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth
            const calendarDay = calendarData.find(day => new Date(day.date).getDate() === dayNumber)

            calendarDays.push(
                <div
                    key={i}
                    className={`w-4 h-4 rounded mx-auto ${
                        isCurrentMonth
                            ? calendarDay?.isCheckedIn
                                ? 'ring-green-500 ring-[1px] bg-green-500/60 dark:bg-slate-400 dark:ring-slate-600'
                                : 'ring-ring ring-[1px] bg-gray-200 dark:bg-white'
                            : 'bg-transparent'
                    }`}
                />
            )
        }

        return calendarDays
    }

    const canGoForward = currentDate.getMonth() < today.getMonth() || currentDate.getFullYear() < today.getFullYear()

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="每日打卡">
            <div className="space-y-4">
                <div className="flex flex-col justify-between items-center">
                    <h3 className="font-semibold">打卡日历</h3>
                    <div className="grid grid-cols-7 gap-1 w-56 h-[200px] text-xs mt-6">
                        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                            <div key={day} className="text-center font-semibold">{day}</div>
                        ))}
                        {renderCalendar()}
                    </div>
                    <div className="flex justify-between items-center">
                        <span>已连续打卡 {currentStreak} 天</span>
                        <Button onClick={handleCheckIn} disabled={isLoading}>
                            {isLoading ? '处理中...' : '打卡'}
                        </Button>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">打卡统计</h3>
                        <p>本月打卡次数：{monthlyCheckIns} 次</p>
                    </div>
                    <div>
                        <div className="flex items-center space-x-2 text-sm">
                            <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}>
                                <ChevronLeft className="h-4 w-4"/>
                            </Button>
                            <span
                                className="w-32 text-center">{currentDate.getFullYear()}年{currentDate.getMonth() + 1}月</span>
                            <Button disabled={!canGoForward} variant="outline" size="sm" onClick={() => changeMonth(1)}>
                                <ChevronRight className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">排行榜</h3>
                        <ul className="space-y-2">
                            {leaderboard.map((entry, index) => (
                                <li key={entry.id} className="flex items-center space-x-2">
                                    <span className="font-bold">{index + 1}.</span>
                                    <img src={entry.avatarUrl} alt={entry.username} className="w-6 h-6 rounded-full"/>
                                    <span>{entry.username}</span>
                                    <span className="ml-auto">{entry.monthlyCheckIns} 次</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

