import React, { useRef, useEffect, useState } from "react";
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
  messages: Message[];
  onSend: (msg: Message) => void;
  userProfile?: string;
};

const initiateCall = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "+2348071745530", 
      }),
    });

    const data = await response.json();
    if (data.success) {
      alert("Call initiated successfully!");
    } else {
      alert("Failed to initiate call: " + data.error);
    }
  } catch (err) {
    console.error("Error initiating call:", err);
    alert("Call failed.");
  }
};

const ChatBox: React.FC<Props> = ({ currentUserId, contactId, messages, onSend, userProfile }) => {
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const CallIcon = IoCallSharp as unknown as React.FC<{ size?: number }>;
  const SendIcon = RiSendPlaneFill as unknown as React.FC<{ size?: number }>;
  const ExpandIcon = FaExpandAlt as unknown as React.FC<{ size?: number }>;

  const sendMessage = () => {
    if (!input.trim()) return;

    if (editingId) {
      const updatedMessage: Message = {
        id: editingId,
        senderId: currentUserId,
        content: input,
        timestamp: new Date().toISOString(),
        read: false,
      };
      onSend(updatedMessage);
      setEditingId(null);
    } else {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: currentUserId,
        content: input,
        timestamp: new Date().toISOString(),
        read: false,
      };
      onSend(newMessage);
    }

    setInput("");
  };

  const handleEdit = (msg: Message) => {
    setInput(msg.content);
    setEditingId(msg.id);
  };

  const handleDelete = (msgId: string) => {
    const confirmed = confirm("Are you sure you want to delete this message?");
    if (confirmed) {
      const deletedMessage: Message = {
        id: msgId,
        senderId: currentUserId,
        content: "", // Empty content to signify deletion
        timestamp: new Date().toISOString(),
        read: false,
      };
      onSend(deletedMessage);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredMessages = messages.filter((msg) => msg.content !== "");

  return (
    <div className={`transition-all duration-300 ${expanded ? "h-[500px]" : "h-[60px]"} w-full rounded-xl p-4 bg-white shadow-md flex flex-col place-self-end`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-medium">Chat with {contactId}</h2>
        <div className="flex items-center gap-3">
          {userProfile && (
            <img src={userProfile} alt="User Profile" className="w-8 h-8 rounded-full object-cover" />
          )}
          <button onClick={initiateCall} className="text-blue-500">
            <CallIcon size={20} />
          </button>
          <button onClick={() => setExpanded((prev) => !prev)} className="text-blue-500">
            <ExpandIcon />
          </button>
        </div>
      </div>

      {expanded && (
        <>
          <div className="overflow-y-auto flex-1 space-y-3 mb-3 pr-1">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUserId ? "items-end" : "items-start"}`}>
                <div className="relative group">
                  <div className={`p-2 rounded-md text-sm max-w-[70%] ${msg.senderId === currentUserId ? "bg-gray-200" : "bg-gray-200"}`}>
                    {msg.content}
                  </div>
                  {msg.senderId === currentUserId && (
                    <div className="absolute top-1 -left-20 hidden group-hover:flex gap-2">
                      <button onClick={() => handleEdit(msg)} className="text-xs text-blue-500 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(msg.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-gray-500 mt-1 pr-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {msg.read ? "✓✓" : "✓"}
                </span>
                <div ref={messagesEndRef} />
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-2">
            <div className="flex-1 border border-pink-400 rounded-md flex items-center focus-within:ring focus-within:ring-purple-400">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder={editingId ? "Editing message..." : "Type a message..."}
                className="flex-1 bg-transparent text-sm outline-none py-2"
              />
            </div>
            <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full">
              <SendIcon size={22} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;

