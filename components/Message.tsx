import {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";

type Props = {
    message: string
    onClose?: void | undefined
}

const Message = (props: Props) => {
    const [isShow, setIsAlert] = useState(false)
    useEffect(() => {
        setIsAlert(true)
        const timeout = setTimeout(() => {
            setIsAlert(false)
        }, 800)
        return () => {
            clearTimeout(timeout)
        }
    }, []);
    return (
        <div
            className={`text-sm bg-pink-600 rounded-xl mb-2 shadow-lg shadow-pink-900 -translate-x-1/2 text-center text-neutral-200 p-1 px-6 ${isShow ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'} duration-300`}>
            {props.message}
        </div>
    )
};

let container: (HTMLDivElement | null) = null;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const showMessage = (message: string) => {
    if (!container) {
        container = document.createElement('div');
        container.className = 'absolute top-10 left-1/2 z-50'
        document.body.appendChild(container);
    }
    const messageElement = <Message message={message}/>;
    const messageDiv = document.createElement('div');
    container.appendChild(messageDiv);
    const root = createRoot(messageDiv);
    root.render(messageElement);

    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
        document.body.removeChild(container!);
        // 重置 container 和 timeoutId
        container = null;
        timeoutId = null;
    }, 1000);
}
export default showMessage;