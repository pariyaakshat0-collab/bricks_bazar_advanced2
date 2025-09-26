"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { useNotification } from "@/components/shared/notification-provider"
import { 
  Send, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile,
  Phone,
  Video,
  Info,
  Star,
  Archive,
  Trash2,
  Filter,
  RefreshCw
} from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  content: string
  timestamp: Date
  read: boolean
  type: "text" | "file" | "system"
  fileName?: string
  fileSize?: string
  fileUrl?: string
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantRole: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isOnline: boolean
  avatar?: string
  isStarred?: boolean
  isArchived?: boolean
}

export default function MessagingPage() {
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filterType, setFilterType] = useState<"all" | "starred" | "archived">("all")

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/messages/conversations")
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error("Failed to load conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
      // Mark conversation as read
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      )
    }
  }, [selectedConversation])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    const tempMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || "",
      senderName: user?.name || "You",
      senderRole: user?.role || "user",
      content: newMessage,
      timestamp: new Date(),
      read: false,
      type: "text"
    }

    setMessages(prev => [...prev, tempMessage])
    setNewMessage("")

    try {
      const response = await fetch(`/api/messages/${selectedConversation}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          type: "text"
        })
      })

      if (response.ok) {
        addNotification({
          type: "info",
          title: "Message Sent",
          message: "Your message has been delivered",
          read: false
        })
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const toggleStarConversation = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, isStarred: !conv.isStarred }
          : conv
      )
    )
  }

  const toggleArchiveConversation = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, isArchived: !conv.isArchived }
          : conv
      )
    )
  }

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
    
    switch (filterType) {
      case "starred":
        return matchesSearch && conv.isStarred
      case "archived":
        return matchesSearch && conv.isArchived
      default:
        return matchesSearch && !conv.isArchived
    }
  })

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={loadConversations}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          {showFilters && (
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "starred" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("starred")}
              >
                <Star className="h-3 w-3 mr-1" />
                Starred
              </Button>
              <Button
                variant={filterType === "archived" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("archived")}
              >
                <Archive className="h-3 w-3 mr-1" />
                Archived
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-[calc(100%-8rem)]">
          {filteredConversations.map((conversation) => (
            <div key={conversation.id}>
              <button
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                  selectedConversation === conversation.id ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {conversation.participantName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conversation.participantName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(conversation.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs mt-1">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
              <Separator />
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Message Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedConv.participantName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedConv.participantName}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedConv.isOnline ? "Online" : "Offline"} • {selectedConv.participantRole}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => toggleStarConversation(selectedConv.id)}>
                    <Star className={`h-4 w-4 ${selectedConv.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleArchiveConversation(selectedConv.id)}>
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.type === "text" ? (
                        <p>{message.content}</p>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{message.fileName}</p>
                            <p className="text-sm opacity-75">{message.fileSize}</p>
                          </div>
                        </div>
                      )}
                      <p className={`text-xs mt-1 ${
                        message.senderId === user?.id ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/30">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Select a conversation to start messaging</p>
              <p className="text-sm text-muted-foreground/60">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}