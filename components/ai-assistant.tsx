"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles,
  Mic,
  Image as ImageIcon,
  Paperclip
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language"

const quickActions = [
  { ar: "أبحث عن قوالب", en: "Find templates" },
  { ar: "مساعدة في التسعير", en: "Help with pricing" },
  { ar: "كيف أبدأ كمبدع؟", en: "How to start as creator?" },
  { ar: "الدعم الفني", en: "Technical support" },
]

export function AIAssistant() {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: language === "ar" 
        ? "مرحباً! أنا مساعد صرحي الذكي. كيف يمكنني مساعدتك اليوم؟" 
        : "Hello! I'm Sarhy's AI assistant. How can I help you today?"
    }
  ])
  const [inputValue, setInputValue] = useState("")
  
  const handleSend = () => {
    if (!inputValue.trim()) return
    
    setMessages(prev => [...prev, { role: "user", content: inputValue }])
    setInputValue("")
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: language === "ar"
          ? "شكراً لرسالتك! أنا أعمل على الإجابة على استفسارك. سيتم تفعيل الذكاء الاصطناعي قريباً."
          : "Thanks for your message! I'm working on answering your query. AI will be fully activated soon."
      }])
    }, 1000)
  }
  
  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 end-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/30 flex items-center justify-center group"
      >
        <Sparkles className="w-6 h-6 text-primary-foreground group-hover:scale-110 transition-transform" />
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-30 blur-lg -z-10 animate-pulse" />
      </motion.button>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Chat Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-6 end-6 z-50 w-[calc(100%-3rem)] sm:w-[400px] h-[500px] glass-strong rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {language === "ar" ? "مساعد صرحي" : "Sarhy Assistant"}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      {language === "ar" ? "متصل الآن" : "Online"}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                
                {/* Quick Actions */}
                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInputValue(language === "ar" ? action.ar : action.en)
                        }}
                        className="px-3 py-1.5 text-xs rounded-full border border-border hover:bg-secondary transition-colors"
                      >
                        {language === "ar" ? action.ar : action.en}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2 bg-secondary rounded-xl p-2">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={language === "ar" ? "اكتب رسالتك..." : "Type your message..."}
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    className="shrink-0 bg-primary hover:bg-primary/90"
                    onClick={handleSend}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
