'use client';

import { useState, useEffect, useRef } from 'react';
import { useCurrentUser } from '@/Contexts/ChatAuthHelper';
import { useAuth } from '@/Contexts/AuthProvider';
import { useRouter } from 'next/navigation';

export default function ChatSupport() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useCurrentUser();
  const isLoggedIn = useAuth();
  const router = useRouter();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (userId) {
      fetchChatHistory();
    }
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`/api/chat?userId=${userId}`);
      const data = await response.json();
      
      if (data.chatHistory) {
        setChatHistory(data.chatHistory);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !userId) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          message: message.trim(),
        }),
      });
      
      const data = await response.json();
      
      setChatHistory(prev => [
        ...prev, 
        data.userMessage, 
        data.botMessage
      ]);
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg flex flex-col h-full">
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">Customer Support</h2>
          <p className="text-sm opacity-80">We're here to help you</p>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="text-center text-gray-500 my-8">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`flex ${chat.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    chat.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{chat.message}</p>
                  <span className="text-xs opacity-70 block mt-1">
                    {new Date(chat.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <form onSubmit={sendMessage} className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || !isLoggedIn}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-full p-2 w-12 h-12 flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading || !isLoggedIn || !message.trim()}
            >
              {loading ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}