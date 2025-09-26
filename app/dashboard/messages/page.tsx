"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Send, Search, Paperclip, Smile, Phone, Video, Info, MoreVertical, Circle, Check, CheckCheck } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface User {
  id: string
  name: string
  email: string
  role: 'buyer' | 'seller' | 'distributor'
  avatar?: string
  status: 'online' | 'offline' | 'away'
  lastSeen?: Date
  isTyping?: boolean
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  type: 'text' | 'image' | 'file' | 'system'
  fileName?: string
  fileSize?: number
  fileUrl?: string
  replyTo?: string
}

interface Conversation {
  id: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  isGroup: boolean
  groupName?: string
  groupAvatar?: string
  lastActivity: Date
  pinned: boolean
  archived: boolean
}

const mockUsers: User[] = [
  {
    id: "user1",
    name: "John Smith",
    email: "john@example.com",
    role: "buyer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: "online",
    lastSeen: new Date()
  },
  {
    id: "user2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "seller",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face",
    status: "away",
    lastSeen: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: "user3",
    name: "Mike Davis",
    email: "mike@example.com",
    role: "distributor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "offline",
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "user4",
    name: "Lisa Chen",
    email: "lisa@example.com",
    role: "buyer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    status: "online",
    lastSeen: new Date()
  }
]

const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: {
      id: "msg1",
      senderId: "user2",
      receiverId: "user1",
      content: "Hi John! I wanted to discuss the concrete pricing for your upcoming project. We have some competitive rates available.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      type: "text"
    },
    unreadCount: 0,
    isGroup: false,
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    pinned: true,
    archived: false
  },
  {
    id: "conv2",
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: {
      id: "msg2",
      senderId: "user3",
      receiverId: "user1",
      content: "Your delivery is scheduled for tomorrow at 2 PM. The route has been optimized for efficiency.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      type: "text"
    },
    unreadCount: 2,
    isGroup: false,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    pinned: false,
    archived: false
  },
  {
    id: "conv3",
    participants: [mockUsers[0], mockUsers[3], mockUsers[1]],
    lastMessage: {
      id: "msg3",
      senderId: "user4",
      receiverId: "conv3",
      content: "Great news! The steel beams have arrived at the warehouse and are ready for pickup.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      type: "text"
    },
    unreadCount: 1,
    isGroup: true,
    groupName: "Downtown Construction Project",
    groupAvatar: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=150&h=150&fit=crop",
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
    pinned: false,
    archived: false
  }
]

const mockMessages: { [key: string]: Message[] } = {
  conv1: [
    {
      id: "msg1",
      senderId: "user2",
      receiverId: "user1",
      content: "Hi John! I wanted to discuss the concrete pricing for your upcoming project. We have some competitive rates available.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      type: "text"
    },
    {
      id: "msg4",
      senderId: "user1",
      receiverId: "user2",
      content: "Hi Sarah! That sounds great. What's the current rate per cubic yard? I'm looking at around 500 cubic yards for the foundation.",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      read: true,
      type: "text"
    },
    {
      id: "msg5",
      senderId: "user2",
      receiverId: "user1",
      content: "For 500 cubic yards, I can offer you $95 per cubic yard. That's about 8% below market rate. We can also include delivery within a 50-mile radius.",
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      read: true,
      type: "text"
    }
  ],
  conv2: [
    {
      id: "msg2",
      senderId: "user3",
      receiverId: "user1",
      content: "Your delivery is scheduled for tomorrow at 2 PM. The route has been optimized for efficiency.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      type: "text"
    },
    {
      id: "msg6",
      senderId: "user1",
      receiverId: "user3",
      content: "Perfect! Can you also pick up the steel beams from the supplier on your way?",
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      read: false,
      type: "text"
    }
  ]
}

export default function MessagingSystem() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentUser = mockUsers[0] // Current logged-in user

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation.id] || [])
    }
  }, [selectedConversation])

  const filteredConversations = conversations.filter(conv => {
    if (searchTerm === "") return true
    
    const searchLower = searchTerm.toLowerCase()
    if (conv.isGroup && conv.groupName?.toLowerCase().includes(searchLower)) return true
    
    return conv.participants.some(user => 
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    )
  })

  const sendMessage = () => {
    if (newMessage.trim() === "" || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedConversation.isGroup ? selectedConversation.id : selectedConversation.participants.find(p => p.id !== currentUser.id)?.id || "",
      content: newMessage.trim(),
      timestamp: new Date(),
      read: false,
      type: "text"
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: message, lastActivity: new Date() }
        : conv
    ))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getOtherParticipant = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return {
        name: conversation.groupName || "Group Chat",
        avatar: conversation.groupAvatar,
        status: "online" as const
      }
    }
    return conversation.participants.find(p => p.id !== currentUser.id) || conversation.participants[0]
  }

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕"]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation)
              const lastMessage = conversation.lastMessage
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={otherParticipant.avatar} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {otherParticipant.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {!conversation.isGroup && (
                        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          getStatusColor(otherParticipant.status)
                        }`} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {otherParticipant.name}
                        </p>
                        {lastMessage && (
                          <span className="text-xs text-gray-500">
                            {formatTime(lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      
                      {lastMessage && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {lastMessage.senderId === currentUser.id && (
                              <span className="text-gray-400 mr-1">You:</span>
                            )}
                            {lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={getOtherParticipant(selectedConversation).avatar} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getOtherParticipant(selectedConversation).name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!selectedConversation.isGroup && (
                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      getStatusColor(getOtherParticipant(selectedConversation).status)
                    }`} />
                  )}
                </div>
                
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {getOtherParticipant(selectedConversation).name}
                  </h2>
                  {!selectedConversation.isGroup && (
                    <p className="text-sm text-gray-500">
                      {getOtherParticipant(selectedConversation).status === "online" ? "Active now" : 
                       getOtherParticipant(selectedConversation).status === "away" ? "Away" : "Offline"}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        View Profile
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        Mute Notifications
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        Block User
                      </Button>
                      <Separator />
                      <Button variant="ghost" className="w-full justify-start text-sm text-red-600">
                        Delete Chat
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => {
                const sender = mockUsers.find(u => u.id === message.senderId)
                const isCurrentUser = message.senderId === currentUser.id
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                      isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={sender?.avatar} />
                          <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                            {sender?.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`px-4 py-2 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center space-x-1 text-xs mt-1 ${
                          isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {isCurrentUser && (
                            message.read ? (
                              <CheckCheck className="h-3 w-3" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" side="top">
                  <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                    {emojis.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => insertEmoji(emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              
              <Textarea
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 resize-none min-h-[40px] max-h-[120px]"
                rows={1}
              />
              
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
          </div>
        </div>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          // Handle file upload
          console.log("File selected:", e.target.files?.[0])
        }}
      />
    </div>
  )
}