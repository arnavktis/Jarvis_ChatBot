import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Send, MessageSquare } from "lucide-react"
import JarvisAnimation from "./JarvisAnimation"
import Image from "next/image"

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: "Welcome back, sir. JARVIS online and ready. How may I assist with your technological marvels today?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "") {
      const newMessage = { id: messages.length, text: inputMessage, isUser: true };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputMessage("");
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputMessage
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMessages(prevMessages => [...prevMessages, { id: prevMessages.length, text: data.response, isUser: false }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages(prevMessages => [...prevMessages, { id: prevMessages.length, text: "I apologize, but there seems to be a technical issue. Please try again later or contact our support team directly.", isUser: false }]);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <Card className={`w-full md:w-[600px] lg:w-[800px] h-[700px] flex flex-col bg-transparent border-white mb-24`}>
      <CardHeader>
        <CardTitle className="text-white text-xl sm:text-2xl flex items-center">
          <Image
            src="/images/Chatbot logo.png"
            alt="Chatbot Logo"
            width={60}
            height={60}
            className="mr-2"
            priority
          />
          <span className="ml-2">JARVIS - AI Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="pl-12 pt-4">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4 relative`}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                >
                  {!message.isUser && (
                    <div className="flex items-start mr-2 absolute -left-10">
                      <JarvisAnimation />
                    </div>
                  )}
                  <span className={cn(
                    "inline-block p-2 sm:p-3 rounded-lg text-base sm:text-lg max-w-[80%]",
                    message.isUser 
                      ? "bg-gradient-to-r from-slate-700 to-slate-800 text-amber-400 border border-amber-500/30" 
                      : "bg-gradient-to-r from-gray-800 to-gray-700 text-blue-300"
                  )}>
                    {message.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex gap-2 sm:gap-3">
        <Input
          placeholder="How may I assist you, sir?"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className={cn(
            "bg-transparent text-white border-white text-base sm:text-lg p-2 sm:p-3",
            "transition-all duration-300 ease-in-out",
            "hover:bg-gradient-to-r hover:from-blue-400/10 hover:to-blue-600/10",
            "focus:bg-gradient-to-r focus:from-blue-400/10 focus:to-blue-600/10"
          )}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isLoading}
          className={cn(
            "bg-blue-500 hover:bg-blue-600 text-white",
            "border-2 border-blue-300",
            "rounded-full w-12 h-12 p-0",
            "flex items-center justify-center",
            "transition-all duration-300 ease-in-out",
            "hover:shadow-lg hover:shadow-blue-500/50",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-t-2 border-white rounded-full"
            />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}