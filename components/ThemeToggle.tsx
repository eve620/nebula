"use client"
import {useEffect, useState} from "react";
import {Moon, Sun} from "lucide-react";
import {Button} from "@/components/ui/button";

const ThemeToggle = () => {
    const [isLight, setIsLight] = useState(true);

    useEffect(() => {
        if (isLight) {
            document.documentElement.classList.remove("dark");
        } else {
            document.documentElement.classList.add("dark");
        }
    }, [isLight]);

    const changeTheme = () => {
        setIsLight((prevIsLight) => !prevIsLight);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={changeTheme}
            className="ml-4"
        >
            {isLight ?
                <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />
            }
            <span className="sr-only">切换主题</span>
        </Button>
    )
}

export default ThemeToggle