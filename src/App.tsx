import { useState } from "react";
import ChatBox from "./components/ChatBox";


type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
};

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="flex gap-6">
        <div className="w-[350px]">
          <h3 className="text-center font-semibold text-lg mb-2">Driver</h3>
          <ChatBox
            currentUserId="Driver"
            contactId="Client"
            messages={messages}
            onSend={handleSend}
            userProfile="/profiles/clientpofile.jpg"
          />
        </div>
        <div className="w-[350px]">
          <h3 className="text-centerfont-semibold text-lg mb-2">Client</h3>
          <ChatBox
            currentUserId="Client"
            contactId="Driver"
            messages={messages}
            onSend={handleSend}
            userProfile="/profiles/driversprofile.jpg"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
