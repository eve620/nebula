import {io, Socket} from "socket.io-client";

class SocketClient {
    private static instance: SocketClient;
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
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

            this.setupEventListeners();
        }
        return this.socket;
    }

    private setupEventListeners(): void {
        if (!this.socket) return;

        this.socket.on("connect", () => {
            console.log("Socket connected successfully");
            this.reconnectAttempts = 0;
        });

        this.socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
            if (reason === "io server disconnect") {
                // 服务器主动断开连接，需要手动重连
                this.socket?.connect();
            }
        });

        this.socket.on("connect_error", (error) => {
            console.error("Connection error:", error);
            this.reconnectAttempts++;

            if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
                console.error("Max reconnection attempts reached");
                this.close();
            }
        });
    }

    public close(): void {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.close();
            this.socket = null;
        }
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
}

// 导出单例实例
export const socketClient = SocketClient.getInstance();

