import {io, Socket} from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
    if (!socket) {
        socket = io('http://localhost:3100')
        // 添加错误处理和重连逻辑
    }
    socket.on("connect", () => {
        console.log("ws-connect")
    })
    return socket;
}

export function closeSocket() {
    if (socket) {
        socket.close();
        socket = null;
    }
}