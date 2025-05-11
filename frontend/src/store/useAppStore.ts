import { create } from 'zustand';

type Message = {
    msg_id: string;
    content: string;
    direction: 'SENT' | 'RECEIVED';
    timestamp: string;
    event_type: string;
};

type Conversation = {
    conversation_id: string;
    state: 'OPEN' | 'CLOSED';
    messages: Message[];
};

type AppState = {
    selectedChatId?: string;
    selectedChatType?: 'OPEN' | 'CLOSED';
    conversationIds: string[]; 
    conversations: Conversation[];
    setSelectedChat: (id: string, type: 'OPEN' | 'CLOSED') => void;
    clearSelectedChat: () => void;
    setConversations: (conversations: Conversation[]) => void;
    setMessagesForConversation: (conversationId: string, messages: Message[]) => void;
    addConversationId: (id: string) => void; 
};

export const useAppStore = create<AppState>((set) => ({
    selectedChatId: undefined,
    selectedChatType: undefined,
    conversationIds: [],
    conversations: [],
    setSelectedChat: (id, type) => set({ selectedChatId: id, selectedChatType: type }),
    clearSelectedChat: () => set({ selectedChatId: undefined, selectedChatType: undefined }),
    setConversations: (conversations) => set({ conversations }),
    setMessagesForConversation: (conversationId, messages) =>
        set((state) => ({
            conversations: state.conversations.map((convo) =>
                convo.conversation_id === conversationId
                    ? { ...convo, messages }
                    : convo
            ),
        })),
    addConversationId: (id) => set((state) => ({
        conversationIds: [...state.conversationIds, id],
    })),
}));
