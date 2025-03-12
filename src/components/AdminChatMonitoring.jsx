import { useState, useEffect } from 'react';
import { Search, User, MessageSquare, Calendar, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export const AdminChatMonitoring = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services/admin/chat');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch conversations. Status: ${response.status}`);
      }
      
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedConversation || !selectedConversation.user?.id) return;
    
    try {
      setDeleteLoading(true);
      setDeleteError(null);
      
      const response = await fetch(`/api/services/admin/chat/${selectedConversation.user.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete conversation. Status: ${response.status}`);
      }
      
      // Remove the deleted conversation from state
      setConversations(conversations.filter(
        convo => convo.user?.id !== selectedConversation.user?.id
      ));
      setSelectedConversation(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredConversations = conversations.filter(convo => {
    const userName = convo.user?.name?.toLowerCase() || '';
    const userEmail = convo.user?.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    // Search in user details
    if (userName.includes(query) || userEmail.includes(query)) {
      return true;
    }
    
    // Search in message content
    return convo.messages.some(msg => 
      msg.message.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <h2 className="text-xl font-bold">Customer Support Conversations</h2>
      </div>
      
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Search conversations by user or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600">
          <p>Error: {error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading conversations...</p>
        </div>
      ) : (
        <div className="flex h-[600px]">
          {/* Conversation List */}
          <div className="w-1/3 border-r overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchQuery ? 'No matching conversations found' : 'No conversations available'}
              </div>
            ) : (
              filteredConversations.map((convo) => (
                <div
                  key={convo.user?.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedConversation?.user?.id === convo.user?.id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setSelectedConversation(convo)}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold">{convo.user?.name || 'Unknown User'}</div>
                      <div className="text-sm text-gray-500">{convo.user?.email || `ID: ${convo.user?.id}`}</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="text-gray-500 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {convo.messages.length} messages
                    </div>
                    <div className="text-gray-500">
                      {convo.messages.length > 0 && format(new Date(convo.messages[convo.messages.length - 1].createdAt), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Conversation Detail */}
          <div className="w-2/3 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold">{selectedConversation.user?.name || 'Unknown User'}</div>
                        <div className="text-sm text-gray-500">{selectedConversation.user?.email || `ID: ${selectedConversation.user?.id}`}</div>
                      </div>
                    </div>
                    {/* Delete Button */}
                    <button 
                      className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(true);
                      }}
                      disabled={deleteLoading}
                      title="Delete conversation"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                      <div className="flex items-center text-red-600 mb-4">
                        <AlertCircle className="w-6 h-6 mr-2" />
                        <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                      </div>
                      <p className="mb-6">
                        Are you sure you want to delete all chat history for 
                        <strong> {selectedConversation.user?.name || selectedConversation.user?.email || 'this user'}</strong>? 
                        This action cannot be undone.
                      </p>
                      {deleteError && (
                        <div className="p-3 mb-4 bg-red-50 text-red-600 rounded border border-red-200">
                          <p>{deleteError}</p>
                        </div>
                      )}
                      <div className="flex justify-end space-x-3">
                        <button
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={deleteLoading}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                          onClick={handleDelete}
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? (
                            <span className="flex items-center">
                              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Deleting...
                            </span>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.isBot
                            ? 'bg-gray-100 text-gray-800 rounded-bl-none'
                            : 'bg-black text-white rounded-br-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.message}</p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>
                            {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p>Select a conversation to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChatMonitoring;