import React from "react";
import ChatBox from "./components/ChatBox";

function App() {
  return (
    <div className="h-screen w-screen p-4 bg-gray-100">
      <ChatBox currentUserId="user1" contactId="user2" />
    </div>
  );
}

export default App;
