"use client"
import React, {useEffect, useState} from "react";
import Answer from "@/app/english/component/Answer";
import {Summary} from "@/app/english/component/Summary";
import Question from "@/app/english/component/Question";
import Tool from "@/app/english/component/Tool";
import Tips from "@/app/english/component/Tips";
import Progress from "@/app/english/component/Progress";
import {useRouter} from "next/navigation";
import {useUser} from "@/contexts/user-context";
import {getLocalProgress, removeLocalProgress, setLocalProgress} from "@/utils/progressStorage";

interface EnglishLayoutProps {
    courseData: {
        id: string,
        title: string,
        statements: [{ chinese: string, english: string, soundmark: string }]
    }
    wordIndex: number
}

const EnglishLayout: React.FC<EnglishLayoutProps> = ({courseData, wordIndex}) => {
    const [currentCourse, setCurrentCourse] = useState(courseData)
    const [statementIndex, setStatementIndex] = useState(wordIndex)
    const [failedCount, setFailedCount] = useState(0);
    const [currentMode, setCurrentMode] =
        useState<"Question" | "Answer" | "Summary">("Question")
    const word = currentCourse.statements[statementIndex]
    const percent = ((statementIndex / currentCourse.statements.length) * 100).toFixed(2)
    const router = useRouter()
    const user = useUser()
    useEffect(() => {
        if (user) {
            removeLocalProgress()
        } else {
            const localProgress = getLocalProgress();
            const fetchData = async () => {
                try {
                    const response = await fetch(`/api/course?id=${localProgress.courseId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setCurrentCourse(data)
                        setFailedCount(0)
                        setCurrentMode("Question")
                    } else {
                        throw new Error('Error');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            if (localProgress) {
                fetchData();
                setStatementIndex(localProgress.wordIndex);
            }
        }
    }, [user]);

    useEffect(() => {
        async function updateProgress() {
            if (user) {
                await fetch("/api/course/progress", {
                    method: "PUT",
                    body: JSON.stringify({
                        course: currentCourse.id,
                        wordIndex: statementIndex,
                    })
                });
            } else {
                setLocalProgress(currentCourse.id, statementIndex);
            }
        }

        const timeoutId = setTimeout(() => updateProgress(), 1000);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [user, currentCourse, statementIndex, router]);


    function handleNext() {
        if (statementIndex < currentCourse.statements.length - 1) {
            setCurrentMode("Question")
            setFailedCount(0)
            setStatementIndex(statementIndex + 1)
        } else {
            setFailedCount(0)
            setCurrentMode("Summary")
        }
    }

    async function handleCourse(id: string) {
        const response = await fetch(`/api/course?id=${id}`);
        if (response.ok) {
            const data = await response.json();
            setCurrentCourse(data)
            setStatementIndex(0)
            setFailedCount(0)
            setCurrentMode("Question")
        } else {
            // Handle error
            throw new Error('Error');
        }
    }

    function showAnswer() {
        if (currentMode === "Question" && failedCount < 3) {
            setFailedCount(3)
        }
    }

    function handleFailedCount() {
        setFailedCount(failedCount + 1)
    }

    function handleAnswer() {
        setFailedCount(0)
        setCurrentMode("Answer")
    }

    function handleWord(index: number) {
        if (index < currentCourse.statements.length && index >= 0) {
            setStatementIndex(index)
            setFailedCount(0)
            setCurrentMode("Question")
        }
    }

    const viewMap = {
        Summary: <Summary handleWord={handleWord}></Summary>,
        Question: <Question word={word} failedCount={failedCount} handleFailedCount={handleFailedCount}
                            handleAnswer={handleAnswer}/>,
        Answer: <Answer word={word} handleNext={handleNext}/>,
    };

    const CurrentView = viewMap[currentMode];


    return (
        <div className={'h-full flex flex-col justify-between'}>
            <div>
                <Tool currentCourse={currentCourse} statementIndex={statementIndex} handleCourse={handleCourse}
                      handleWord={handleWord}/>
                <Progress currentMode={currentMode} percent={percent}/>
            </div>
            <div className={"flex flex-col justify-center items-center"}>
                {CurrentView}
            </div>
            <Tips statementIndex={statementIndex} handleWord={handleWord} showAnswer={showAnswer}
                  english={word.english}/>
        </div>
    )
}

export default EnglishLayout