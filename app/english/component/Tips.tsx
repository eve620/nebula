import React, {useEffect} from "react";

interface TipsProps {
    statementIndex: number,
    handleWord: (id: number) => void
    showAnswer: () => void,
    english: string
}

const Tips: React.FC<TipsProps> = ({statementIndex, handleWord, showAnswer, english}) => {
    const audioRef = React.useRef<HTMLAudioElement>(null);

    function updateSource(src: string) {
        if (audioRef.current) {
            audioRef.current.src = src;
            audioRef.current.load();
        }
    }

    useEffect(() => {
        if (english) {
            updateSource(`https://dict.youdao.com/dictvoice?audio=${english}&type=2`)
        }
    }, [english])
    const handlePlayClick = async () => {
        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
            await audioElement.play();
        }
    };
    return (
        <div className={"flex justify-between py-4"}>
            <button className={"hover:text-fuchsia-400"} onClick={() => {
                handleWord(statementIndex - 1)
            }}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="3em"
                    height="3em"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="m15 5l-6 7l6 7"
                    />
                </svg>
            </button>
            <button onClick={handlePlayClick}
                    className={"text-sm font-semibold px-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800"}>播放发音
            </button>
            <button onClick={showAnswer}
                    className={"text-sm font-semibold px-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800"}>显示答案
            </button>
            <button className={"hover:text-fuchsia-400"} onClick={() => {
                handleWord(statementIndex + 1)
            }}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="3em"
                    height="3em"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="m9 5l6 7l-6 7"
                    />
                </svg>
            </button>
            <audio ref={audioRef}>
                <source src={`https://dict.youdao.com/dictvoice?audio=${english}&type=1`}/>
            </audio>
        </div>
    )
}

export default Tips