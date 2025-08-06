interface User {
    id: string;
    name: string;
}

interface Message {
    userId: string;
    content: string;
    timestamp: Date;
}

interface GroupChat {
    id: string;
    name: string;
    users: User[];
    messages: Message[];
}

interface Admin {
    id: string;
    name: string;
    isAdmin: boolean;
}

interface ChatEvent {
    type: 'message' | 'join' | 'leave' | 'broadcast';
    payload: Message | User | GroupChat;
}