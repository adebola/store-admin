import {Component, DestroyRef, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule, DatePipe, NgClass, NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {ChatPanelToggleService} from './chat-panel-toggle.service';
import {ChatService} from '../../shared/service/chat.service';
import {SnackbarService} from '../../shared/service/snackbar.service';
import {CustomizerSettingsService} from '../../customizer-settings/customizer-settings.service';
import {ChatSession, ChatMessage} from '../../shared/model/chat.model';

@Component({
    selector: 'app-chat-panel',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatListModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        NgScrollbarModule,
    ],
    templateUrl: './chat-panel.component.html',
    styleUrl: './chat-panel.component.scss'
})
export class ChatPanelComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    isOpen = false;
    view: 'sessions' | 'chat' = 'sessions';
    sessions: ChatSession[] = [];
    currentSession: ChatSession | null = null;
    messages: ChatMessage[] = [];
    newMessage = '';
    loadingSessions = false;
    loadingMessages = false;
    sendingMessage = false;

    @ViewChild('messagesEnd') messagesEnd!: ElementRef;
    @ViewChild('messageInput') messageInput!: ElementRef;

    constructor(
        public toggleService: ChatPanelToggleService,
        private chatService: ChatService,
        private snackbar: SnackbarService,
        public themeService: CustomizerSettingsService
    ) {}

    ngOnInit() {
        this.toggleService.isChatPanelOpen$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(isOpen => {
                this.isOpen = isOpen;
                if (isOpen && this.view === 'sessions') {
                    this.loadSessions();
                }
            });
    }

    @HostListener('document:keydown.escape')
    onEscape() {
        if (this.isOpen) {
            this.toggleService.close();
        }
    }

    loadSessions() {
        this.loadingSessions = true;
        this.chatService.getSessions()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (sessions) => {
                    this.sessions = sessions;
                    this.loadingSessions = false;
                },
                error: () => {
                    this.snackbar.message('Failed to load chat sessions');
                    this.loadingSessions = false;
                }
            });
    }

    selectSession(session: ChatSession) {
        this.currentSession = session;
        this.view = 'chat';
        this.loadMessages(session.id);
    }

    loadMessages(sessionId: string) {
        this.loadingMessages = true;
        this.messages = [];
        this.chatService.getSessionMessages(sessionId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (messages) => {
                    this.messages = messages;
                    this.loadingMessages = false;
                    this.scrollToBottom();
                },
                error: () => {
                    this.snackbar.message('Failed to load messages');
                    this.loadingMessages = false;
                }
            });
    }

    createNewSession() {
        this.loadingSessions = true;
        this.chatService.createSession()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (session) => {
                    this.loadingSessions = false;
                    this.currentSession = session;
                    this.messages = [];
                    this.view = 'chat';
                    setTimeout(() => this.focusInput(), 100);
                },
                error: () => {
                    this.snackbar.message('Failed to create chat session');
                    this.loadingSessions = false;
                }
            });
    }

    sendMessage() {
        const text = this.newMessage.trim();
        if (!text || !this.currentSession || this.sendingMessage) return;

        // Add user message to UI immediately
        const userMsg: ChatMessage = {
            id: 'temp_user_' + Date.now(),
            sessionId: this.currentSession.id,
            content: text,
            sender: 'user',
            timestamp: new Date().toISOString()
        };
        this.messages.push(userMsg);
        this.newMessage = '';
        this.sendingMessage = true;
        this.scrollToBottom();

        this.chatService.sendMessage(text, this.currentSession.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const aiMsg: ChatMessage = {
                        id: 'ai_' + Date.now(),
                        sessionId: this.currentSession!.id,
                        content: res.response,
                        sender: 'ai',
                        timestamp: new Date().toISOString(),
                        metadata: res.metadata
                    };
                    this.messages.push(aiMsg);
                    this.sendingMessage = false;
                    this.scrollToBottom();
                    if (this.currentSession) {
                        this.currentSession.messageCount++;
                    }
                },
                error: () => {
                    this.snackbar.message('Failed to send message');
                    this.sendingMessage = false;
                }
            });
    }

    deleteSession(session: ChatSession, event: MouseEvent) {
        event.stopPropagation();
        this.chatService.deleteSession(session.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.sessions = this.sessions.filter(s => s.id !== session.id);
                    if (this.currentSession?.id === session.id) {
                        this.backToSessions();
                    }
                },
                error: () => {
                    this.snackbar.message('Failed to delete session');
                }
            });
    }

    backToSessions() {
        this.view = 'sessions';
        this.currentSession = null;
        this.messages = [];
        this.loadSessions();
    }

    trackBySessionId(_index: number, session: ChatSession): string {
        return session.id;
    }

    trackByMessageId(_index: number, message: ChatMessage): string {
        return message.id;
    }

    private scrollToBottom() {
        setTimeout(() => {
            if (this.messagesEnd) {
                this.messagesEnd.nativeElement.scrollIntoView({behavior: 'smooth'});
            }
        }, 50);
    }

    private focusInput() {
        if (this.messageInput) {
            this.messageInput.nativeElement.focus();
        }
    }
}
