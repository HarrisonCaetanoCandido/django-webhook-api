import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

type Message = {
    direction: 'SENT' | 'RECEIVED';
    content: string;
    timestamp?: string;
};

type Conversation = {
    conversation_id: string;
    state: string;
};

export default function ConvoContainer() {
    const { selectedChatId, selectedChatType, conversations, setConversations, setMessagesForConversation, setSelectedChat } = useAppStore();

    const [sentMessages, setSentMessages] = useState<Message[]>([]);
    const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
    const [allMessages, setAllMessages] = useState<Message[]>([]);

    const [formType, setFormType] = useState<'NEW_MESSAGE' | 'CLOSE_CONVERSATION'>("NEW_MESSAGE");
    const [formDirection, setFormDirection] = useState<"SENT" | "RECEIVED">("SENT");
    const [formContent, setFormContent] = useState("");

    const [openConversations, setOpenConversations] = useState<Conversation[]>([]);
    const [closedConversations, setClosedConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        const processMessages = () => {
            const selectedConvo = conversations.find(
                convo => convo.conversation_id === selectedChatId
            );

            if (selectedConvo && selectedConvo.messages) {
                const sent: Message[] = [];
                const received: Message[] = [];

                selectedConvo.messages.forEach((msg: Message) => {
                    if (msg.direction === 'SENT') sent.push(msg);
                    else if (msg.direction === 'RECEIVED') received.push(msg);
                });

                setSentMessages(sent);
                setReceivedMessages(received);
                setAllMessages([...sent, ...received].sort((a, b) => {
                    if (a.timestamp && b.timestamp) {
                        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                    }
                    return 0;
                }));
            } else {
                setSentMessages([]);
                setReceivedMessages([]);
                setAllMessages([]);
            }
        };

        processMessages();
    }, [selectedChatId, conversations]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/conversations/${selectedChatId}`);

            if (!res.ok) throw new Error(`Failed to fetch ${selectedChatId}`);

            const conversationData = await res.json();

            setMessagesForConversation(selectedChatId!, conversationData.messages);

            const open = conversationData.state === 'OPEN' ? [conversationData] : [];
            const closed = conversationData.state === 'CLOSED' ? [conversationData] : [];

            setSelectedChat(selectedChatId!, conversationData.state);
            setOpenConversations(open);
            setClosedConversations(closed);
            setConversations([conversationData]);
        } catch (err) {
            toast("Could not fetch convo")
            console.error('Could not fetch convo:', err);
        }
    };


    const sendWebhookMessage = async ({
        type,
        direction,
        content,
        selectedChatId,
    }: {
        type: 'NEW_MESSAGE' | 'CLOSE_CONVERSATION';
        direction?: 'SENT' | 'RECEIVED';
        content?: string;
        selectedChatId: string;
    }) => {
        const timestamp = new Date().toISOString();
        const id = uuidv4();

        let payload: any = {
            type,
            timestamp,
            data: {},
        };

        if (type === 'CLOSE_CONVERSATION') {
            payload.data.id = selectedChatId || id;
        }

        if (type === 'NEW_MESSAGE') {
            payload.data = {
                id,
                direction,
                content,
                conversation_id: selectedChatId,
            };
        }

        try {
            const res = await fetch('/api/webhook/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`Erro ao enviar webhook: ${res.statusText}`);

            const data = await res.json();
            console.log("Webhook enviado com sucesso:", data);
            toast("Webhook enviado com sucesso")

            return data;
        } catch (error) {
            toast("Erro no envio do webhook")
            console.error("Erro no envio do webhook:", error);
        }
    };

    const handleSubmit = async () => {
        await sendWebhookMessage({
            type: formType,
            direction: formDirection,
            content: formContent,
            selectedChatId: selectedChatId!,
        });

        setFormContent("");
        fetchMessages();

    };

    return (
        <div className="p-4 space-y-6">
            <div>
                <p className="text-lg text-center font-semibold text-gray-800 mb-2">
                    Conversa de ID {selectedChatId}
                </p>
                <p className="text-lg text-center font-semibold text-gray-800 mb-4">
                    Estado {selectedChatType}
                </p>
            </div>
            <div className="flex mb-4 space-x-4">
                <div className="flex-1 border-2 border-blue-500 p-4 rounded-lg max-h-[250px] overflow-y-auto">
                    <p className="text-center text-blue-500 font-bold mb-2">SENT</p>
                    <ul className="space-y-1 text-sm">
                        {sentMessages.map((msg, idx) => (
                            <li key={idx} className="bg-blue-100 p-2 rounded">{msg.content}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex-1 border-2 border-green-500 p-4 rounded-lg max-h-[250px] overflow-y-auto">
                    <p className="text-center text-green-500 font-bold mb-2">RECEIVED</p>
                    <ul className="space-y-1 text-sm">
                        {receivedMessages.map((msg, idx) => (
                            <li key={idx} className="bg-green-100 p-2 rounded">{msg.content}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="border-t pt-6">
                <p className="text-center font-semibold text-gray-800 mb-4">Enviar Nova Mensagem</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Select onValueChange={(val) =>
                        setFormType(val as "NEW_MESSAGE" | "CLOSE_CONVERSATION")}
                        defaultValue="NEW_MESSAGE">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tipo da ação" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NEW_MESSAGE">NEW_MESSAGE</SelectItem>
                            <SelectItem value="CLOSE_CONVERSATION">CLOSE_CONVERSATION</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={val => setFormDirection(val as "SENT" | "RECEIVED")} defaultValue="SENT">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Direção" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SENT">SENT</SelectItem>
                            <SelectItem value="RECEIVED">RECEIVED</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        placeholder="Conteúdo da mensagem"
                    />
                </div>
                <div className="text-center">
                    <Button onClick={handleSubmit} className="px-6 py-2">
                        Enviar
                    </Button>
                </div>
            </div>
        </div>
    );
}
