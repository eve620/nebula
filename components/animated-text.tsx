'use client'

import React, {useState, useEffect} from 'react'

export function AnimatedText({text}: { text: string }) {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => {
                if (prev < text.length) {
                    return prev + 1
                } else {
                    clearInterval(timer)
                    return prev
                }
            })
        }, 100)

        return () => clearInterval(timer)
    }, [text])

    return (
        <span className="font-semibold">
            {text.slice(0, index)}
            <span className="animate-pulse">|</span>
        </span>
    )
}