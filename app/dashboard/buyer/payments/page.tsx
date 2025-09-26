"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PaymentDialog } from "@/components/shared/payment-system"
import { CreditCard, Clock, CheckCircle, AlertCircle, Download } from "lucide-react"

const paymentHistory = [
  {
    id: "PAY-001",
    orderId: "ORD-12345",
    amount: 25000,
    status: "completed",
    method: "UPI",
    date: "2024-01-15",
    description: "500 Red Bricks + Delivery",
  },
  {
    id: "PAY-002",
    orderId: "ORD-12346",
    amount: 15000,
    status: "pending",
    method: "Net Banking",
    date: "2024-01-14",
    description: "Cement Bags (50 units)",
  },
  {
    id: "PAY-003",
    orderId: "ORD-12347",
    amount: 8500,
    status: "failed",
    method: "Credit Card",
    date: "2024-01-13",
    description: "Steel Rods Bundle",
  },
]

export default function PaymentsPage() {
  const [pendingPayment, setPendingPayment] = useState<any>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <p className="text-muted-foreground">Manage your payments and transaction history</p>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹48,500</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹15,000</div>
            <p className="text-xs text-muted-foreground">1 transaction pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,500</div>
            <p className="text-xs text-muted-foreground">1 failed transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(payment.status)}
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.id} • {payment.method} • {payment.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">₹{payment.amount.toLocaleString()}</p>
                    <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                  </div>
                  {payment.status === "pending" && (
                    <PaymentDialog
                      amount={payment.amount}
                      orderId={payment.orderId}
                      onPaymentSuccess={(paymentId) => {
                        console.log("Payment completed:", paymentId)
                      }}
                    >
                      <Button size="sm">Pay Now</Button>
                    </PaymentDialog>
                  )}
                  {payment.status === "failed" && (
                    <PaymentDialog
                      amount={payment.amount}
                      orderId={payment.orderId}
                      onPaymentSuccess={(paymentId) => {
                        console.log("Payment retried:", paymentId)
                      }}
                    >
                      <Button size="sm" variant="outline">
                        Retry
                      </Button>
                    </PaymentDialog>
                  )}
                  {payment.status === "completed" && (
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
