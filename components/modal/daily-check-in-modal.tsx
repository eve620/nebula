'use client'

import {useState, useEffect} from 'react'
import {Modal} from "@/components/modal/modal"
import {Button} from "@/components/ui/button"
import {ChevronLeft, ChevronRight} from 'lucide-react'

interface DailyCheckInModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
}

interface CheckInData {
    userId: string
    date: string
}

interface RankingItem {
    userId: string
    username: string
    checkInCount: number
}

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
const today = new Date()

export function DailyCheckInModal({isOpen, onClose, userId}: DailyCheckInModalProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [checkIns, setCheckIns] = useState<CheckInData[]>([])
    const [ranking, setRanking] = useState<RankingItem[]>([])
    const [userCheckInCount, setUserCheckInCount] = useState(0)

    useEffect(() => {
        if (isOpen) {
            fetchCheckIns()
            fetchRanking()
        }
    }, [isOpen, currentDate])

    const fetchCheckIns = async () => {
        // 模拟API调用获取用户的打卡数据
        const mockCheckIns: CheckInData[] = [
            {userId, date: '2023-12-01'},
            {userId, date: '2023-12-02'},
            {userId, date: '2023-12-03'},
            // ... 更多模拟数据
        ]
        setCheckIns(mockCheckIns)
        setUserCheckInCount(mockCheckIns.length)
    }

    const fetchRanking = async () => {
        // 模拟API调用获取排行榜数据
        const mockRanking: RankingItem[] = [
            {userId: '1', username: '用户A', checkInCount: 30},
            {userId: '2', username: '用户B', checkInCount: 28},
            {userId: '3', username: '用户C', checkInCount: 25},
            // ... 更多模拟数据
        ]
        setRanking(mockRanking)
    }

    const handleCheckIn = async () => {
        // 模拟API调用进行打卡
        const newCheckIn: CheckInData = {userId, date: new Date().toISOString().split('T')[0]}
        setCheckIns([...checkIns, newCheckIn])
        setUserCheckInCount(userCheckInCount + 1)
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
        const totalDays = daysInMonth(year, month)
        const firstDayOfMonth = new Date(year, month, 1).getDay()
        const calendarDays = []
        for (let i = 0; i < 42; i++) {
            const dayNumber = i - firstDayOfMonth + 1
            const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
            const isCurrentMonth = dayNumber > 0 && dayNumber <= totalDays
            const isCheckedIn = checkIns.some(checkIn => checkIn.date === date)

            calendarDays.push(
                <div
                    key={i}
                    className={`w-4 h-4 rounded mx-auto ${
                        isCurrentMonth
                            ? isCheckedIn
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
                <div className="flex justify-between items-center">
                    <span>已连续打卡 {userCheckInCount} 天</span>
                    <Button onClick={handleCheckIn}>打卡</Button>
                </div>
                <div className="h-[200px] overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-2">打卡排行榜</h3>
                    <ul className="space-y-2">
                        {ranking.map((item, index) => (
                            <li key={item.userId} className="flex justify-between items-center">
                                <span>{index + 1}. {item.username}</span>
                                <span>{item.checkInCount} 天</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Modal>
    )
}

