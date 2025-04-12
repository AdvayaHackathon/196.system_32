import React, { useState, useEffect } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Create and append the iframe when chat is opened
    const iframe = document.createElement('iframe');
    iframe.src = 'https://copilotstudio.microsoft.com/environments/Default-84c31ca0-ac3b-4eae-ad11-519d80233e6f/bots/cr5be_maitreyi/webchat?version=2';
    iframe.style.width = '100%';
    iframe.style.height = '500px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '0 0 8px 8px';
    iframe.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';

    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.appendChild(iframe);
    }

    // Cleanup function to remove iframe when component unmounts or chat is closed
    return () => {
      if (chatContainer) {
        const existingIframe = chatContainer.querySelector('iframe');
        if (existingIframe) {
          chatContainer.removeChild(existingIframe);
        }
      }
    };
  }, [isOpen]);

  return (
    <>
      {/* Chat Interface */}
      {isOpen && (
        <div 
          id="chat-container"
          className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-lg"
          style={{ zIndex: 1000 }}
        >
          <div className="p-4 bg-green-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Healthcare Assistant</h3>
            <button 
              className="text-white hover:text-gray-200 focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 focus:outline-none flex items-center space-x-2 transition-all duration-200 ease-in-out"
        style={{ zIndex: 1000 }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
          />
        </svg>
        <span className="font-medium">Need Help?</span>
      </button>
    </>
  );
};

export default ChatBot; 