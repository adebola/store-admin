import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ChatSession, ChatMessage, ChatSendResponse} from "../model/chat.model";

const CHAT_URL = environment.base_url + '/chat';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(
        private http: HttpClient,
    ) {}

    getSessions(limit: number = 20): Observable<ChatSession[]> {
        return this.http.get<{success: boolean, data: {sessions: any[]}}>(`${CHAT_URL}/history`, {
            params: {limit: limit}
        }).pipe(
            map(res => res.data.sessions.map(s => ({
                id: s._id || s.id,
                userId: s.user,
                title: s.title || 'Chat Session',
                createdAt: s.startTime || s.createdAt,
                updatedAt: s.lastActivity || s.updatedAt,
                messageCount: s.messageCount || 0,
                isActive: s.isActive
            })))
        );
    }

    getSessionMessages(sessionId: string): Observable<ChatMessage[]> {
        return this.http.get<{success: boolean, messages: ChatMessage[]}>(`${CHAT_URL}/session/${sessionId}/messages`).pipe(
            map(res => res.messages)
        );
    }

    createSession(): Observable<ChatSession> {
        return this.http.post<{success: boolean, session: any}>(`${CHAT_URL}/session`, {}).pipe(
            map(res => ({
                id: res.session.id,
                userId: res.session.userId,
                title: res.session.title || 'New Chat',
                createdAt: res.session.createdAt,
                updatedAt: res.session.updatedAt || res.session.createdAt,
                messageCount: res.session.messageCount || 0,
                isActive: res.session.isActive
            }))
        );
    }

    sendMessage(message: string, sessionId: string): Observable<ChatSendResponse> {
        return this.http.post<{success: boolean, data: any}>(`${CHAT_URL}/message`, {
            message: message,
            sessionId: sessionId
        }).pipe(
            map(res => res.data)
        );
    }

    deleteSession(sessionId: string): Observable<any> {
        return this.http.delete(`${CHAT_URL}/session/${sessionId}`);
    }
}
