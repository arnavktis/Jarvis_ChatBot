import * as React from "react"
import { useState, useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  text: string;
  isUser: boolean;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage("");
      // Here you would typically call an API to get the chatbot's response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: "This is a sample response from the chatbot.", isUser: false }]);
      }, 1000);
    }
  }

  const getCardWidth = () => {
    if (windowSize.width < 640) return 'w-full'; // Mobile
    if (windowSize.width < 1024) return 'w-[600px]'; // Tablet
    return 'w-[800px]'; // Desktop
  }

  const getCardHeight = () => {
    if (windowSize.width < 640) {
      const mobileHeight = Math.max(500, windowSize.height - 100);
      return `h-[${mobileHeight}px]`; // Mobile
    }
    return 'h-[700px]'; // Tablet and Desktop
  }

  return (
    <Card ref={cardRef} className={`${getCardWidth()} ${getCardHeight()} flex flex-col bg-transparent border-white mb-24`}>
      <CardHeader>
        <CardTitle className="text-white text-xl sm:text-2xl">Chatbot</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="flex flex-col space-y-4 p-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <span className={`inline-block p-2 sm:p-3 rounded-lg text-base sm:text-lg max-w-[80%] ${message.isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                  {message.text}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex gap-2 sm:gap-3">
        <Input
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className={cn(
            "bg-transparent text-white border-white text-base sm:text-lg p-2 sm:p-3",
            "transition-all duration-300 ease-in-out",
            "hover:bg-gradient-to-r hover:from-purple-400/10 hover:via-pink-400/10 hover:to-red-400/10",
            "focus:bg-gradient-to-r focus:from-purple-400/10 focus:via-pink-400/10 focus:to-red-400/10",
            "animate-shimmer bg-[length:200%_100%] bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400"
          )}
        />
        <Button onClick={handleSendMessage} className="bg-green-500 hover:bg-green-600 text-white border-white text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3">Send</Button>
      </CardFooter>
    </Card>
  )
}
