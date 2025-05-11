'use client'

import CustomHeader from "@/components/CustomHeader";
import CustomFooter from "@/components/CustomFooter";
import Sidebar from "@/components/Sidebar";
import { useAppStore } from "@/store/useAppStore";
import ConvoContainer from '@/components/conversation/ConvoContainer';
import EmptyConvoContainer from "@/components/conversation/EmptyConvoContainer";

export default function Page() {
	const { selectedChatId, selectedChatType, setSelectedChat } = useAppStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
            <CustomHeader />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar/>
                <div className="flex-1 flex flex-col">
                    {selectedChatId ? (
						<ConvoContainer/>
					) : (
						<EmptyConvoContainer/>
					)}
                </div>
            </div>
            <CustomFooter />
        </div>
  );
}

