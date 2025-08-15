import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI health assistant. I can help you understand your cycle patterns, provide health tips, and answer questions about women's health. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const chatMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", { question });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: data.answer,
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    },
    onError: () => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !chatMutation.isPending) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: input.trim(),
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      chatMutation.mutate(input.trim());
      setInput("");
    }
  };

  const quickQuestions = [
    "I've been feeling more tired than usual lately. Is this normal during my cycle?",
    "What foods can help with period cramps?",
    "How can I improve my sleep quality?",
  ];

  const handleQuickQuestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(question);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-96 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-sage-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">LifeCycle AI Assistant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Gemini AI</p>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start space-x-3 ${message.isUser ? 'justify-end' : ''}`}>
            {!message.isUser && (
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-sage-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`rounded-lg p-3 max-w-sm ${
              message.isUser 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <p className={`text-sm ${message.isUser ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {message.text}
              </p>
            </div>
            {message.isUser && (
              <div className="w-8 h-8 bg-gradient-to-r from-coral-300 to-primary-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
            )}
          </div>
        ))}
        
        {chatMutation.isPending && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-sage-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Try asking:</p>
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(question)}
                className="text-left text-xs p-2 h-auto whitespace-normal"
              >
                {question}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your health..."
            className="flex-1"
            disabled={chatMutation.isPending}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || chatMutation.isPending}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
