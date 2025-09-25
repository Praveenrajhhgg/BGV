import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';

// Message type definition
interface Message {
  role: 'user' | 'model';
  text: string;
}

// System instruction for the chatbot
const systemInstruction = `You are a friendly and helpful support agent for GetmeVerify, a background verification platform. Your goal is to assist clients with their questions about the platform, our verification processes (like ID Verification, Employment History, etc.), billing inquiries, and technical issues. Keep your answers helpful, concise, and easy to understand. Do not make up information if you don't know the answer; instead, suggest contacting a human support representative at support@getmeverify.com.`;

const SupportPage: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I'm the GetmeVerify AI assistant. How can I help you today?",
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize the chat model
  useEffect(() => {
    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chatInstance = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemInstruction,
        },
      });
      setChat(chatInstance);
    } catch (e: any) {
        console.error("Failed to initialize AI Chat:", e);
        setError(`Could not initialize the AI chat service. Please check the API key configuration. Details: ${e.message}`);
    }
  }, []);
  
  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chat) return;

    const userMessage: Message = { role: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const stream = await chat.sendMessageStream({ message: userMessage.text });
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text += chunkText;
          return newMessages;
        });
      }
    } catch (e) {
        console.error("Error sending message:", e);
        const errorMessage = "Sorry, I encountered an error. Please try again or contact support if the issue persists.";
        setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.role === 'user';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div 
          className={`max-w-md lg:max-w-2xl px-4 py-2.5 rounded-2xl break-words ${isUser ? 'bg-brand-accent text-white rounded-br-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-lg'}`}
          dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }}
        />
      </div>
    );
  };
  
   const TypingIndicator = () => (
    <div className="flex justify-start">
        <div className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 rounded-bl-lg">
            <div className="flex items-center space-x-1">
                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
            </div>
        </div>
    </div>
  );


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Support Center</h1>
      <div className="bg-brand-primary-light dark:bg-brand-primary-dark rounded-xl border border-slate-200 dark:border-slate-700 h-[70vh] flex flex-col">
        {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-sm rounded-t-xl">{error}</div>
        )}
        <div ref={chatContainerRef} className="flex-1 p-6 space-y-4 overflow-y-auto">
            {messages.map((msg, index) => <ChatBubble key={index} message={msg} />)}
            {isLoading && <TypingIndicator />}
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={isLoading ? "Waiting for response..." : "Ask a question..."}
              disabled={isLoading || !!error}
              className="flex-1 w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent disabled:opacity-50"
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim() || !!error}
              className="p-3 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send message"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
