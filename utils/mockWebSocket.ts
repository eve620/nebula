type Listener = (data: any) => void;

class MockWebSocket {
  private listeners: { [event: string]: Listener[] } = {};

  constructor() {
    // 模拟接收服务器消息
    setInterval(() => {
      this.emit('friendRequest', {
        id: Math.random().toString(36).substr(2, 9),
        username: `User${Math.floor(Math.random() * 1000)}`,
        avatarUrl: '/placeholder.svg'
      });
    }, 10000); // 每10秒模拟一个新的好友请求
  }

  on(event: string, callback: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, data: any) {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }

  // 模拟发送消息到服务器
  send(message: string) {
    console.log('Sent to server:', message);
    // 在这里你可以添加模拟服务器响应的逻辑
  }
}

export const mockWebSocket = new MockWebSocket();

