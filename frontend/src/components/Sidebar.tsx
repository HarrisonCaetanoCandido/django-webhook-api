import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from "@/components/ui/button"
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';

type TitleProps = {
    text: string;
};

const Title = ({ text }: TitleProps) => {
    return (
        <p className='uppercase tracking-widest text-neutral-500 pl-5 font-light text-opacity-90 text-sm'>
            {text}
        </p>
    );
};

type Conversation = {
    conversation_id: string;
    state: string;
};

export default function Sidebar() {
    const [openConversations, setOpenConversations] = useState<Conversation[]>([]);
    const [closedConversations, setClosedConversations] = useState<Conversation[]>([]);
    const {
        conversationIds,
        addConversationId,
        selectedChatId,
        setSelectedChat,
        setConversations,
        setMessagesForConversation,
        clearSelectedChat
    } = useAppStore();

    const [newConvo, setNewConvo] = useState<Conversation>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchConversations = async () => {
        try {
            const promises = conversationIds.map(async (id) => {
                const res = await fetch(`/api/conversations/${id}`);
                if (!res.ok) throw new Error(`Failed to fetch ${id}`);
                const conversationData = await res.json();
                setMessagesForConversation(id, conversationData.messages);
                return {
                    ...conversationData,
                    messages: conversationData.messages,
                };
            });

            const res = await Promise.all(promises);

            const open = res.filter((convo) => convo.state === 'OPEN');
            const closed = res.filter((convo) => convo.state === 'CLOSED');

            setOpenConversations(open);
            setClosedConversations(closed);
            setConversations(res);
        } catch (err) {
            toast("Could not fetch convo")
            console.error('Could not fetch convos:', err);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    const handleClick = (id: string, state: 'OPEN' | 'CLOSED') => {
        if (selectedChatId === id)
            clearSelectedChat();
        else {
            setSelectedChat(id, state);
            fetchConversations();
        }
    };

    const createConvo = async () => {
        const timestamp = new Date().toISOString();

        const payload = {
            type: 'NEW_CONVERSATION',
            timestamp,
            data: {
                id: newConvo!.conversation_id,
            },
        };

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
            addConversationId(newConvo!.conversation_id);
            fetchConversations();
            setSelectedChat(newConvo!.conversation_id, 'OPEN');
            setIsDialogOpen(false);
            // window.location.reload();
            toast("Conversa criada")
        } catch (err) {
            toast("Erro no envio do webhook")
            console.error("Erro no envio do webhook:", err);
        }

        fetchConversations();
    }

    return (
        <div className='relative w-[40vw] sm:w-[40vw] md:w-[25vw] lg:w-[20vw] xl:w-[15vw] border-gray-300 border-r bg-gray-50'>
            <div className='my-5'>
                <Title text="Nova Conversa" />
                <div className='flex justify-center items-center mt-1 text-gray-500'>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Criar nova conversa</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Criar nova conversa</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                <Input className='mb-3' value={'NEW_CONVERSATION'} disabled />
                                <Input className='mb-3'
                                    placeholder='Insira um ID de conversa: 6a41b347-8d80-4ce9-84ba-7af66f369f6a'
                                    onChange={(e) => setNewConvo({
                                        conversation_id: e.target.value,
                                        state: 'OPEN'
                                    })} />
                                <Button onClick={createConvo}>Enviar requisição</Button>
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className='my-5'>
                <Title text="Conversas abertas" />
                <ul>
                    {openConversations.map(convo => (
                        <li key={convo.conversation_id} className='text-sm text-gray-800 flex justify-center'>
                            <button
                                className={`
                                    w-[90%] rounded-2xl text-white mt-1 p-1
                                    ${selectedChatId === convo.conversation_id
                                        ? 'bg-blue-500'
                                        : 'bg-slate-500 hover:bg-slate-600'}
                                    focus:outline-none focus:ring-2 focus:ring-blue-300
                                `}
                                onClick={() => handleClick(convo.conversation_id, "OPEN")}>
                                {convo.conversation_id}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='my-5'>
                <Title text="Conversas fechadas" />
                <ul>
                    {closedConversations.map(convo => (
                        <li key={convo.conversation_id} className='text-sm text-gray-800 flex justify-center'>
                            <button
                                className={`
                                    w-[90%] rounded-2xl text-white mt-1 p-1
                                    ${selectedChatId === convo.conversation_id
                                        ? 'bg-blue-500'
                                        : 'bg-slate-500 hover:bg-slate-600'}
                                    focus:outline-none focus:ring-2 focus:ring-blue-300
                                `}
                                onClick={() => handleClick(convo.conversation_id, "CLOSED")}>
                                {convo.conversation_id}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
