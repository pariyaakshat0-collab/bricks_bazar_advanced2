"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, TrendingUp, Clock, Download } from "lucide-react"

const earnings = [
  {
    id: "EARN-001",
    orderId: "ORD-12345",
    amount: 25000,
    commission: 1250,
    netAmount: 23750,
    status: "paid",
    date: "2024-01-15",
    buyer: "ABC Construction",
  },
  {
    id: "EARN-002",
    orderId: "ORD-12346",
    amount: 15000,
    commission: 750,
    netAmount: 14250,
    status: "pending",
    date: "2024-01-14",
    buyer: "XYZ Builders",
  },
]

export default function SellerPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <p className="text-muted-foreground">Track your earnings and payment history</p>
      </div>

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹38,000</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹14,250</div>
            <p className="text-xs text-muted-foreground">1 payment pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,000</div>
            <p className="text-xs text-muted-foreground">5% platform fee</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings History */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {earnings.map((earning) => (
              <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Order from {earning.buyer}</p>
                  <p className="text-sm text-muted-foreground">
                    {earning.orderId} • {earning.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">₹{earning.netAmount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Commission: ₹{earning.commission.toLocaleString()}</p>
                  </div>
                  <Badge variant={earning.status === "paid" ? "default" : "secondary"}>{earning.status}</Badge>
                  {earning.status === "paid" && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Receipt
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
