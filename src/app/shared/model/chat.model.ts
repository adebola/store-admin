export interface ChatSession {
    id: string;
    userId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messageCount: number;
    isActive: boolean;
}

export interface ChatMessage {
    id: string;
    sessionId: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: string;
    metadata?: any;
}

export interface ChatSendResponse {
    response: string;
    intent: string;
    confidence: number;
    sessionId: string;
    metadata?: {
        responseTime: number;
        timestamp: string;
    };
}
