"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, TrendingUp, Users, AlertTriangle, Search, Download } from "lucide-react"

const platformTransactions = [
  {
    id: "TXN-001",
    type: "commission",
    amount: 1250,
    from: "Seller ABC",
    orderId: "ORD-12345",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "TXN-002",
    type: "delivery_fee",
    amount: 150,
    from: "Distributor XYZ",
    orderId: "ORD-12346",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "TXN-003",
    type: "refund",
    amount: -500,
    from: "Buyer DEF",
    orderId: "ORD-12347",
    status: "processed",
    date: "2024-01-13",
  },
]

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <p className="text-muted-foreground">Monitor platform transactions and financial overview</p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,45,000</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,250</div>
            <p className="text-xs text-muted-foreground">5% platform fee</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Transactions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">-5% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Platform Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-10 w-64" />
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platformTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "commission"
                        ? "bg-green-100"
                        : transaction.type === "delivery_fee"
                          ? "bg-blue-100"
                          : "bg-red-100"
                    }`}
                  >
                    <CreditCard
                      className={`h-4 w-4 ${
                        transaction.type === "commission"
                          ? "text-green-600"
                          : transaction.type === "delivery_fee"
                            ? "text-blue-600"
                            : "text-red-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium capitalize">{transaction.type.replace("_", " ")}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.from} • {transaction.orderId} • {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                      {transaction.amount < 0 ? "-" : "+"}₹{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
