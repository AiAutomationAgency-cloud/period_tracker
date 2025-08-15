import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, User, Bot, Sparkles, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI health assistant. I can help answer questions about your menstrual cycle, pregnancy, wellness, and general health. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessageMutation = useMutation({
    mutationFn: async (question: string) => {
      return apiRequest("POST", "/api/ai/chat", { question });
    },
    onSuccess: (response: any) => {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + "-assistant",
        role: "assistant",
        content: response.answer || "I'm sorry, I couldn't process your question. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: () => {
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: "I'm sorry, there was an error processing your request. Please make sure you have a valid API key configured.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + "-user",
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(input);
    setInput("");
  };

  const handleQuickQuestion = (question: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString() + "-user",
      role: "user",
      content: question,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(question);
  };

  const quickQuestions = [
    "What are the phases of my menstrual cycle?",
    "How can I reduce period cramps?",
    "What foods help with PMS symptoms?",
    "Is spotting between periods normal?",
  ];

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm h-[600px] flex flex-col">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-sage-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Health Assistant</h3>
      </div>

      {/* Quick Questions */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => handleQuickQuestion(question)}
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
              data-testid={`quick-question-${index}`}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4" data-testid="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex space-x-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "user" 
                  ? "bg-primary-500 text-white" 
                  : "bg-gray-200 dark:bg-gray-700"
              }`}>
                {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 opacity-70 ${
                  message.role === "user" ? "text-primary-100" : "text-gray-500 dark:text-gray-400"
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        {sendMessageMutation.isPending && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-900 dark:text-white">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about your health..."
          className="flex-1"
          disabled={sendMessageMutation.isPending}
          data-testid="chat-input"
        />
        <Button
          type="submit"
          disabled={!input.trim() || sendMessageMutation.isPending}
          className="bg-primary-500 hover:bg-primary-600 text-white"
          data-testid="send-button"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  );
}