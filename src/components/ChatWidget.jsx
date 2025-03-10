// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useCurrentUser } from '@/Contexts/ChatAuthHelper';

// export default function ChatWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [message, setMessage] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { userId } = useCurrentUser();
//   const messagesEndRef = useRef(null);
//   const lastMessageTimeRef = useRef(0);
  
//   // Rate limiting - minimum time between messages (3 seconds)
//   const MESSAGE_RATE_LIMIT = 3000; 

//   // Scroll to bottom of chat
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   // Fetch chat history when component mounts or chat is opened
//   useEffect(() => {
//     if (userId && isOpen) {
//       fetchChatHistory();
//     }
//   }, [userId, isOpen]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [chatHistory]);

//   const fetchChatHistory = async () => {
//     setError(null);
//     try {
//       const response = await fetch(`/api/chat?userId=${userId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch chat history');
//       }
//       const data = await response.json();
      
//       if (data.chatHistory) {
//         setChatHistory(data.chatHistory);
//       }
//     } catch (error) {
//       console.error('Error fetching chat history:', error);
//       setError('Unable to load chat history. Please try again later.');
//     }
//   };

//   const sendMessage = async (e) => {
//     e.preventDefault();
    
//     if (!message.trim() || !userId) return;
    
//     // Check rate limit
//     const now = Date.now();
//     if (now - lastMessageTimeRef.current < MESSAGE_RATE_LIMIT) {
//       // Add a temporary message to indicate rate limiting
//       setChatHistory(prev => [
//         ...prev,
//         {
//           id: `temp-${now}`,
//           isBot: true,
//           message: "Please wait a moment before sending another message.",
//           createdAt: new Date().toISOString()
//         }
//       ]);
//       return;
//     }
    
//     // Update last message time
//     lastMessageTimeRef.current = now;
    
//     setLoading(true);
//     setError(null);
    
//     // Optimistically add user message to chat
//     const optimisticUserMsg = {
//       id: `opt-user-${now}`,
//       userId,
//       message: message.trim(),
//       isBot: false,
//       createdAt: new Date().toISOString()
//     };
    
//     setChatHistory(prev => [...prev, optimisticUserMsg]);
//     const currentMessage = message.trim();
//     setMessage('');
    
//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId: userId,
//           message: currentMessage,
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to send message');
//       }
      
//       const data = await response.json();
      
//       // Replace optimistic message with real one and add bot response
//       setChatHistory(prev => {
//         const filtered = prev.filter(msg => msg.id !== optimisticUserMsg.id);
//         return [...filtered, data.userMessage, data.botMessage];
//       });
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setError('Failed to send message. Please try again.');
      
//       // Add error message to chat
//       setChatHistory(prev => [
//         ...prev,
//         {
//           id: `error-${now}`,
//           isBot: true,
//           message: "Sorry, I'm having trouble connecting right now. Please try again later.",
//           createdAt: new Date().toISOString()
//         }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!userId) {
//     return null; // Don't show chat widget for non-logged in users
//   }

//   return (
//     <div className="fixed bottom-5 right-5 z-50">
//       {/* Chat Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
//         aria-label="Open support chat"
//       >
//         {isOpen ? (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         ) : (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//           </svg>
//         )}
//       </button>

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
//           {/* Chat Header */}
//           <div className="bg-blue-600 text-white p-3">
//             <h3 className="font-medium">Customer Support</h3>
//           </div>
          
//           {/* Chat Messages */}
//           <div className="flex-1 overflow-y-auto p-3 space-y-3">
//             {error && (
//               <div className="bg-red-100 text-red-800 p-2 rounded text-sm mb-2">
//                 {error}
//               </div>
//             )}
            
//             {chatHistory.length === 0 ? (
//               <div className="text-center text-gray-500 my-4">
//                 <p>How can we help you today?</p>
//               </div>
//             ) : (
//               chatHistory.map((chat) => (
//                 <div
//                   key={chat?.id || `chat-${Math.random()}`}
//                   className={`flex ${chat?.isBot || chat?.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
//                 >
//                   <div
//                     className={`max-w-[80%] p-2 rounded-lg text-sm ${
//                       chat?.isBot || chat?.role === 'assistant'
//                         ? 'bg-gray-100 text-gray-800'
//                         : 'bg-blue-500 text-white'
//                     }`}
//                   >
//                     <p>{chat?.message || chat?.content}</p>
//                     <span className="text-xs opacity-70 block mt-1">
//                       {chat?.createdAt ? new Date(chat.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString()}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={messagesEndRef} />
//           </div>
          
//           {/* Chat Input */}
//           <form onSubmit={sendMessage} className="border-t p-2">
//             <div className="flex gap-1">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type your message..."
//                 className="flex-1 border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 disabled={loading}
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50"
//                 disabled={loading || !message.trim()}
//               >
//                 {loading ? (
//                   <span className="animate-spin text-sm">⟳</span>
//                 ) : (
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import { useCurrentUser } from '@/Contexts/ChatAuthHelper';
import { format } from 'date-fns';
import clsx from 'clsx';
import { 
  XMarkIcon, 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const BotAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
    <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />
  </div>
);

const UserAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
    <span className="text-white text-sm font-medium">You</span>
  </div>
);

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const { userId } = useCurrentUser();
  const messagesEndRef = useRef(null);
  const lastMessageTimeRef = useRef(0);
  const inputRef = useRef(null);
  
  const MESSAGE_RATE_LIMIT = 3000;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { userId } = useCurrentUser(); // Add loading state

  useEffect(() => {
    if (userId && isOpen && !loading) {
      console.log('Attempting to fetch chat history with userId:', userId);
      fetchChatHistory();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [userId, isOpen, loading]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const fetchChatHistory = async () => {
    if (loading) return; // Don't fetch if still loading user
    if (!userId) {
      console.error('No userId available for chat history fetch');
      setError('User ID not available. Please log in again.');
      return;
    }
    
    setError(null);
    try {
      console.log(`Fetching chat history for userId: ${userId}`);
      const response = await fetch(`/api/chat?userId=${userId}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Failed to fetch chat history: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched chat data:', data);
      
      if (data.chatHistory) {
        setChatHistory(data.chatHistory);
      } else {
        console.warn('No chat history in response data');
        setChatHistory([]);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setError('Unable to load chat history. Please try again later.');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    


    if (!message.trim()) return;
    if (!userId) {
        setError('User ID not available. Please log in again.');
        return;
      }

    
    const now = Date.now();
    if (now - lastMessageTimeRef.current < MESSAGE_RATE_LIMIT) {
      setChatHistory(prev => [
        ...prev,
        {
          id: `temp-${now}`,
          isBot: true,
          message: "Please wait a moment before sending another message.",
          createdAt: new Date().toISOString()
        }
      ]);
      return;
    }
    
    lastMessageTimeRef.current = now;
    setLoading(true);
    setError(null);
    
    const optimisticUserMsg = {
      id: `opt-user-${now}`,
      userId,
      message: message.trim(),
      isBot: false,
      createdAt: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, optimisticUserMsg]);
    const currentMessage = message.trim();
    setMessage('');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          message: currentMessage,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      setChatHistory(prev => {
        const filtered = prev.filter(msg => msg.id !== optimisticUserMsg.id);
        return [...filtered, data.userMessage, data.botMessage];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      
      setChatHistory(prev => [
        ...prev,
        {
          id: `error-${now}`,
          isBot: true,
          message: "Sorry, I'm having trouble connecting right now. Please try again later.",
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "transition-all duration-200 ease-in-out",
          "flex items-center justify-center",
          "w-14 h-14 rounded-full shadow-lg",
          isOpen ? "bg-gray-900" : "bg-black hover:bg-gray-900",
        )}
        aria-label="Open support chat"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-white" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-black text-white p-4 flex items-center gap-3">
            <BotAvatar />
            <div>
              <h3 className="font-semibold">Customer Support</h3>
              <p className="text-xs text-gray-300">Always here to help</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm mb-2 flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                {error}
              </div>
            )}
            
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-500 my-8">
                <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">How can we help you today?</p>
                <p className="text-sm text-gray-400 mt-1">Type your message below to get started</p>
              </div>
            ) : (
              chatHistory.map((chat) => {
                const isUser = !chat?.isBot && chat?.role !== 'assistant';
                return (
                  <div
                    key={chat?.id || `chat-${Math.random()}`}
                    className={clsx(
                      "flex gap-3 items-end w-full",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isUser && <BotAvatar />}
                    <div
                      className={clsx(
                        "max-w-[70%] p-3 rounded-2xl text-sm",
                        isUser
                          ? "bg-black text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{chat?.message || chat?.content}</p>
                      <span className={clsx(
                        "text-[10px] block mt-1",
                        isUser ? "text-gray-300" : "text-gray-500"
                      )}>
                        {chat?.createdAt ? format(new Date(chat.createdAt), 'HH:mm') : format(new Date(), 'HH:mm')}
                      </span>
                    </div>
                    {isUser && <UserAvatar />}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={sendMessage} className="border-t p-4 bg-gray-50">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className={clsx(
                  "flex-1 rounded-full px-4 py-2.5 text-sm",
                  "border border-gray-300",
                  "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50",
                  "placeholder:text-gray-400",
                  "disabled:bg-gray-50 disabled:text-gray-500"
                )}
                disabled={loading}
              />
              <button
                type="submit"
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "bg-black hover:bg-gray-900 disabled:bg-gray-300",
                  "transition-colors duration-200"
                )}
                disabled={loading || !message.trim()}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <PaperAirplaneIcon className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}