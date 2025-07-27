import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { axiosProblem } from '../../../utils/axiosClient.js';
import { Send } from 'lucide-react';

export default function ChatAITab({ problem }) {
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      parts: [{ text: "Hello! I'm here to help you with this problem. Ask me anything!" }],
      isTypingComplete: false 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const messagesEndRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const typingAnimationRef = useRef(false);

  // Memoized typewriter effect
  const typeMessage = useCallback(async (messageIndex) => {
    if (typingAnimationRef.current) return;
    typingAnimationRef.current = true;
    
    const message = messages[messageIndex];
    if (message.role === 'model' && message.parts[0].text && !message.isTypingComplete) {
      const fullText = message.parts[0].text;
      let displayedText = '';
      
      setIsTyping(true);

      for (let i = 0; i < fullText.length; i++) {
        displayedText = fullText.substring(0, i + 1);
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[messageIndex] = {
            ...newMessages[messageIndex],
            parts: [{ text: displayedText }]
          };
          return newMessages;
        });
        await new Promise(resolve => setTimeout(resolve, 20)); // Adjust typing speed here
      }

      // Mark message as completely typed
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[messageIndex] = {
          ...newMessages[messageIndex],
          isTypingComplete: true
        };
        return newMessages;
      });

      setIsTyping(false);
      typingAnimationRef.current = false;
    }
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing effect for new AI messages
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'model') {
      const lastIndex = messages.length - 1;
      const lastMessage = messages[lastIndex];
      
      if (lastMessage.parts[0].text && !lastMessage.isTypingComplete) {
        typeMessage(lastIndex);
      }
    }
  }, [messages, typeMessage]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // Add user message
      const userMessage = { 
        role: 'user', 
        parts: [{ text: data.message }],
        isTypingComplete: true
      };
      setMessages(prev => [...prev, userMessage]);
      reset();

      // Add temporary empty message (will be replaced by AI response)
      setMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: "" }],
        isTypingComplete: false 
      }]);

      // Prepare messages for API
      const response = await axiosProblem.post("/ai/chat", {
        messages: [...messages, userMessage],
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode
      });

      // Update the last message with the response
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'model',
          parts: [{ text: response.data?.data || "I couldn't generate a response. Please try again." }],
          isTypingComplete: false // Will trigger typing effect
        };
        return newMessages;
      });
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'model',
          parts: [{ text: "Sorry, I encountered an error. Please try again later." }],
          isTypingComplete: false
        };
        return newMessages;
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white px-4 pt-4">CHAT with AI</h2>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user" 
                ? "bg-blue-500 text-white dark:bg-blue-600" 
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`}
            >
              {msg.parts[0].text}
              {isTyping && index === messages.length - 1 && (
                <span className="typing-dots">
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="sticky bottom-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-2">
          <input 
            placeholder="Ask me anything about this problem..." 
            className="flex-1 p-2 text-lg rounded input input-bordered bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            {...register("message", { 
              required: "Message is required", 
              minLength: { 
                value: 2, 
                message: "Message must be at least 2 characters" 
              } 
            })}
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            className="btn btn-primary dark:btn-secondary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
      </form>

      <style jsx>{`
        .typing-dots {
          display: inline-flex;
          align-items: center;
          height: 1em;
        }
        .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: currentColor;
          margin: 0 2px;
          opacity: 0;
          animation: dot-animation 1.4s infinite ease-in-out;
        }
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes dot-animation {
          0% { opacity: 0.2; transform: translateY(0); }
          20% { opacity: 1; transform: translateY(-2px); }
          100% { opacity: 0.2; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}