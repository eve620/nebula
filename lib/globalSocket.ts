import {io, Socket} from "socket.io-client";

class SocketClient {
    private static instance: SocketClient;
    private socket: Socket | null = null;
    private readonly MAX_RECONNECT_ATTEMPTS = 5;
    private readonly RECONNECT_INTERVAL = 5000;

    private constructor() {
    }

    public static getInstance(): SocketClient {
        if (!SocketClient.instance) {
            SocketClient.instance = new SocketClient();
        }
        return SocketClient.instance;
    }

    public getSocket(): Socket | null {
        if (!this.socket) {
            this.socket = io(process.env.NEXT_PUBLIC_WS_URL, {
                reconnection: true,
                reconnectionAttempts: this.MAX_RECONNECT_ATTEMPTS,
                reconnectionDelay: this.RECONNECT_INTERVAL,
            });
        }
        return this.socket;
    }

    public isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    public emit(event: string, data): void {
        if (this.socket && this.isConnected()) {
            this.socket.emit(event, data);
        } else {
            console.warn('Socket is not connected. Message not sent:', {event, data});
        }
    }

    public close(): void {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.close();
            this.socket = null;
        }
    }
}

// 导出单例实例
export const socketClient = SocketClient.getInstance();

