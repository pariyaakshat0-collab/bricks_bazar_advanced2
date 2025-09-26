"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Search, Filter, Clock, CheckCircle } from "lucide-react"
import { format } from "date-fns"

interface Message {
  id: string
  sender: string
  subject: string
  content: string
  timestamp: Date
  status: "read" | "unread" | "replied"
  type: "order" | "delivery" | "payment" | "general"
  priority: "low" | "medium" | "high"
}

export default function DistributorMessages() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  const [messages] = useState<Message[]>([
    {
      id: "1",
      sender: "ABC Construction Ltd",
      subject: "Urgent delivery request - Site A",
      content: "We need 500 bags of cement delivered to our downtown construction site by tomorrow morning. Can you confirm availability and delivery time?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "unread",
      type: "delivery",
      priority: "high"
    },
    {
      id: "2",
      sender: "Mega Builders",
      subject: "Payment confirmation for order #DB-2024-001",
      content: "Payment of ₹2,50,000 has been processed for the recent bulk order. Please confirm receipt and arrange delivery.",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: "read",
      type: "payment",
      priority: "medium"
    },
    {
      id: "3",
      sender: "Urban Developers",
      subject: "New order inquiry - Steel reinforcement bars",
      content: "We are looking for 50 tons of steel reinforcement bars for our upcoming project. Please provide pricing and availability details.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "replied",
      type: "order",
      priority: "medium"
    },
    {
      id: "4",
      sender: "City Construction Co",
      subject: "Delivery location update",
      content: "Please update the delivery location for our pending order. New address: Plot 45, Industrial Area, Phase 2.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "read",
      type: "delivery",
      priority: "low"
    }
  ])

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "all" || message.type === filterType
    return matchesSearch && matchesFilter
  })

  const handleReply = () => {
    if (replyText.trim() && selectedMessage) {
      // In a real app, this would send the reply
      alert(`Reply sent to ${selectedMessage.sender}: ${replyText}`)
      setReplyText("")
      setSelectedMessage(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive"
      case "medium": return "secondary"
      case "low": return "outline"
      default: return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order": return "📦"
      case "delivery": return "🚚"
      case "payment": return "💳"
      default: return "💬"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4" />
          <span>{messages.filter(m => m.status === "unread").length} unread messages</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Messages</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="order">Orders</option>
                <option value="delivery">Deliveries</option>
                <option value="payment">Payments</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Messages List */}
            <div className="space-y-3">
              <ScrollArea className="h-[500px]">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border rounded-lg mb-3 cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id ? "bg-accent border-accent" : "hover:bg-gray-50"
                    } ${message.status === "unread" ? "bg-blue-50 border-blue-200" : ""}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {message.sender.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-sm">{message.sender}</h4>
                          <p className="text-xs text-muted-foreground">
                            {format(message.timestamp, "MMM dd, yyyy HH:mm")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant={getPriorityColor(message.priority)} className="text-xs">
                          {message.priority}
                        </Badge>
                        <span className="text-lg">{getTypeIcon(message.type)}</span>
                      </div>
                    </div>
                    <h5 className="font-medium text-sm mb-1">{message.subject}</h5>
                    <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                    {message.status === "unread" && (
                      <div className="mt-2">
                        <Badge variant="destructive" className="text-xs">New</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Message Detail & Reply */}
            <div className="space-y-4">
              {selectedMessage ? (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{selectedMessage.sender}</CardTitle>
                          <CardDescription>{selectedMessage.subject}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityColor(selectedMessage.priority)}>
                            {selectedMessage.priority}
                          </Badge>
                          <span className="text-lg">{getTypeIcon(selectedMessage.type)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{format(selectedMessage.timestamp, "MMMM dd, yyyy 'at' HH:mm")}</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm">{selectedMessage.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Reply</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={4}
                        />
                        <Button onClick={handleReply} className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-[500px] flex items-center justify-center">
                  <CardContent>
                    <div className="text-center space-y-4">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <h3 className="text-lg font-medium">Select a message</h3>
                        <p className="text-sm text-muted-foreground">Choose a message from the list to view details and reply</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}