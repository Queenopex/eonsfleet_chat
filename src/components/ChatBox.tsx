import React, { useState, useEffect, useRef } from "react";
import { IoCallSharp} from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaExpandAlt } from "react-icons/fa";


type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
};

type Props = {
  currentUserId: string;
  contactId: string;
};

const ChatBox: React.FC<Props> = ({ currentUserId, contactId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const CallIcon = IoCallSharp as unknown as React.FC<{ size?: number }>;
  const SendIcon = RiSendPlaneFill as unknown as React.FC<{ size?: number }>;
  const ExpandIcon = FaExpandAlt as unknown as React.FC<{ size?: number }>;


  useEffect(() => {

  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      content: input,
      timestamp: new Date().toISOString(),
      read: false,
    };

    
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const initiateCall = () => {
    console.log("Call initiated");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`transition-all duration-300 ${expanded ? "h-[500px]" : "h-[60px]"} w-1/4 mt-8 border rounded-xl p-4 bg-white shadow-md place-self-end`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-medium">Chat with Driver</h2>
        <div className="flex gap-2">
          <button onClick={initiateCall} className="text-blue-500"><CallIcon size={18} /></button>
          <button onClick={() => setExpanded((prev) => !prev)} className="text-blue-600"> <ExpandIcon/> </button>
        </div>
      </div>

      {expanded && (
        <>
          <div className="overflow-y-auto h-[340px] space-y-2 mb-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-md text-sm max-w-[70%] ${msg.senderId === currentUserId ? "bg-blue-100 self-end ml-auto" : "bg-gray-100"}`}
              >
                <div>{msg.content}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()} {msg.read ? "✓✓" : "✓"}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className=" border-pink-400 flex items-center border rounded-full px-3 py-1 focus-within:ring-2 focus-within:ring-purple-400 transition2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm outline-none py-2"
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white hover:text-blue-800">
              <SendIcon size={18} />
               </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
