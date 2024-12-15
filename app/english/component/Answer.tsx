import React, {useEffect, useRef} from "react";
import Display from "@/app/english/component/Display";

interface AnswerProps {
    word: {
        chinese: string,
        english: string,
        soundmark: string,
    },
    handleNext: () => void
}

export default function Answer({word: {chinese, english, soundmark}, handleNext}: AnswerProps) {
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                handleNext();
            }
        }

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleNext]);
    const handlePlayClick = async () => {
        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
            await audioElement.play();
        }
    };
    return (
        <div className={"flex flex-col items-center"}>
            <Display chinese={chinese} soundmark={soundmark} english={english} handlePlayClick={handlePlayClick}/>
            <audio autoPlay ref={audioRef}>
                <source src={`https://dict.youdao.com/dictvoice?audio=${english}&type=1`}/>
            </audio>
            <button onClick={handleNext}
                    className="bg-gray-100 text-gray-500 font-bold text-xl px-4 py-1 rounded-lg mt-4
                    hover:bg-gray-500 hover:text-gray-100 hover:duration-300
                    dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                next
            </button>
        </div>
    )
}