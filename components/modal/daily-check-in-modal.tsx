'use client'

import {useEffect, useState} from 'react'
import {Modal} from "@/components/modal/modal"
import {Button} from "@/components/ui/button"
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {useUser} from "@/contexts/user-context";
import showMessage from "@/components/message";

interface DailyCheckInModalProps {
    isOpen: boolean
    onClose: () => void
}

interface LeaderboardEntry {
    userId: number
    username: string
    avatarUrl: string
    nickname: string
    totalCheckIns: number
}


const today = new Date()

export function DailyCheckInModal({isOpen, onClose}: DailyCheckInModalProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [checkedInDates, setCheckedInDates] = useState<string[]>([])
    const [currentStreak, setCurrentStreak] = useState(0)
    const [monthlyCheckIns, setMonthlyCheckIns] = useState(0)
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const user = useUser()
    useEffect(() => {
        fetchUserCheckInInfo()
        fetchLeaderboard()
    }, [])

    const fetchUserCheckInInfo = async () => {
        try {
            const response = await fetch('/api/daily-check-in')
            const res = await response.json()
            if (response.ok) {
                setCurrentStreak(res.currentStreak)
                setMonthlyCheckIns(res.monthlyCheckIns)
                setCheckedInDates(res.checkedInDates)
            } else {
                throw new Error('获取打卡记录失败')
            }
        } catch (error) {
            console.error('获取打卡记录失败:', error)
        }
    }

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('/api/daily-check-in/leaderboard')
            if (!response.ok) {
                throw new Error('获取排行榜失败')
            }
            const data = await response.json()
            setLeaderboard(data)
        } catch (error) {
            showMessage("获取排行榜失败！")
        }
    }

    const handleCheckIn = async () => {
        const response = await fetch('/api/daily-check-in', {
            method: 'POST',
            body: JSON.stringify({userId: user?.id}),
        })
        const res = await response.json()
        if (response.ok) {
            showMessage(res.message)
            fetchUserCheckInInfo()
            fetchLeaderboard()
        } else {
            showMessage(res.error)
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
            const calendarDay = checkedInDates.find(day => {
                const date = new Date(day)
                return date.getMonth() === month && date.getDate() === dayNumber
            })

            calendarDays.push(
                <div
                    key={i}
                    className={`w-4 h-4 rounded mx-auto text-foreground/70 dark:text-background/80 select-none text-center font-semibold ${
                        isCurrentMonth
                            ? calendarDay?.length
                                ? 'ring-green-500 ring-[1px] bg-green-500/60 dark:bg-slate-400 dark:ring-slate-600'
                                : 'ring-ring ring-[1px] bg-gray-200 dark:bg-white'
                            : 'opacity-0'
                    }`}
                >{dayNumber}</div>
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
                    <div>
                        <div className="flex items-center space-x-2 text-sm mb-4">
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
                    <div className="flex justify-around items-center w-full mb-4">
                        <div className={'flex flex-col justify-center items-center space-y-1 text-sm'}>
                            <span>本月打卡次数：{monthlyCheckIns} 次</span>
                            <span>已连续打卡 {currentStreak} 天</span>
                        </div>
                        <Button onClick={handleCheckIn}>
                            打卡
                        </Button>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-center">排行榜</h3>
                        <ul className="space-y-2">
                            {leaderboard.map((entry, index) => (
                                <li key={entry.userId} className="flex items-center space-x-2">
                                    <span className="font-bold">{index + 1}.</span>
                                    <img src={entry?.avatarUrl || "/avatar.jpg"} alt={entry.username}
                                         className="w-6 h-6 rounded-full"/>
                                    <span>{entry?.nickname || entry.username}</span>
                                    <span className="ml-auto">总打卡 {entry.totalCheckIns} 次</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

