import {useEffect, useRef, useState} from "react";
import Display from "@/app/(container)/english/component/Display";

interface QuestionProps {
    word: {
        chinese: string,
        english: string,
        soundmark: string,
    }
    failedCount: number,
    handleFailedCount: () => void,
    handleAnswer: () => void,
}

function Question({word: {chinese, english, soundmark}, failedCount, handleFailedCount, handleAnswer}: QuestionProps) {
    const [inputValue, setInputValue] = useState("");
    const failedCountLimit = 3;
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const words = english.split(" ");
    const [inputWords, setInputWords] = useState<string[]>([""])
    const tipAudioRef = useRef<HTMLAudioElement | null>(null)

    function inputWidth(word: string) {
        // 单词宽度
        let width = 0;
        // 单词转小写字符数组
        word = word.toLocaleLowerCase();
        const wordArr = word.split("");

        // 字符宽度1.1的字符数组
        const onePointOneLetters = ["u", "o", "p", "q", "n", "h", "g", "d", "b"];

        // 字符宽度0.9的字符数组
        const zeroPointNineLetters = ["z", "y", "x", "v", "c"];

        for (let letter of wordArr) {
            if (letter === "w" || letter === "m") {
                width += 1.5;
                continue;
            }
            if (letter === "s") {
                width += 0.8;
                continue;
            }
            if (letter === "t" || letter === "r" || letter === "f") {
                width += 0.7;
                continue;
            }
            if (letter === "j") {
                width += 0.6;
                continue;
            }
            if (letter === "i" || letter === "l" || letter === "'") {
                width += 0.5;
                continue;
            }

            // 记录是否已经增加宽度
            let increasedWidth = false;

            for (let key of onePointOneLetters) {
                if (key === letter) {
                    width += 1.1;
                    increasedWidth = true;
                    break;
                }
            }

            for (let key of zeroPointNineLetters) {
                if (key === letter) {
                    width += 0.9;
                    increasedWidth = true;
                    break;
                }
            }

            // 未增加宽度
            if (!increasedWidth) {
                width += 1;
            }
        }

        // 左右留白
        width += 1;
        return width;
    }

    useEffect(() => {
        setInputValue("")
        if (inputRef.current) {
            inputRef.current!.focus();
        }
    }, [chinese, english, soundmark]);

    useEffect(() => {
        // 当 inputValue 发生变化时，触发此回调函数
        const words = inputValue.split(" ");
        setInputWords(words);
    }, [inputValue]);

    const validateInput = (value: string) => {
        return !(value.startsWith(" ") || value.endsWith("  ") || countSpaces(value) > english.split(" ").length - 1);

    };

    function countSpaces(str: string) {
        // 使用正则表达式匹配字符串中的空格，并返回匹配结果的数量
        return (str.match(/ /g) || []).length;
    }

    const handleInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (validateInput(event.target.value)) {
            setInputValue(event.target.value);
            tipAudioRef.current = new Audio()
            tipAudioRef.current!.src = "/sounds/typing.mp3"
            tipAudioRef.current!.load()
            tipAudioRef.current!.play()
        }
    };
    const handlePlayClick = async () => {
        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
            await audioElement.play();
        }
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            if (inputValue.toLowerCase() === english.toLowerCase()) {
                tipAudioRef.current = new Audio()
                tipAudioRef.current!.src = "/sounds/right.mp3"
                tipAudioRef.current!.load()
                tipAudioRef.current!.play()
                handleAnswer()
            } else {
                setInputValue("")
                tipAudioRef.current = new Audio()
                tipAudioRef.current!.src = "/sounds/error.mp3"
                tipAudioRef.current!.load()
                tipAudioRef.current!.play()
                handleFailedCount()
            }
        }
    }

    return (
        <>
            {failedCount >= failedCountLimit ?
                <div className={"flex flex-col items-center"}>
                    <Display chinese={chinese} soundmark={soundmark} english={english}
                             handlePlayClick={handlePlayClick}/>
                    <audio autoPlay ref={audioRef}>
                        <source src={`https://dict.youdao.com/dictvoice?audio=${english}&type=1`}/>
                    </audio>
                </div> :
                <div className={"text-2xl"}>{chinese}</div>
            }
            <div className={"relative flex flex-wrap justify-center gap-2 transition-all"}>
                {words.map((word, index) => (
                    <div key={index}
                         style={{minWidth: `${inputWidth(word)}ch`}}
                         className={`h-[4rem] text-center leading-none border-solid rounded-[2px] border-b-2 text-[3rem] transition-all ${inputWords.length - 1 === index && "border-fuchsia-500"}`}
                    >
                        {inputWords[index]}
                    </div>
                ))}
                <input type="text" value={inputValue}
                       onChange={handleInputValue}
                       onKeyDown={handleKeyDown}
                       onMouseDown={(event) => {
                           event.preventDefault()
                           inputRef.current && inputRef.current!.focus()
                       }}
                       ref={inputRef}
                       className={"absolute h-full w-full opacity-0"}
                />
            </div>
        </>
    )
}

export default Question