"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, TrendingUp, Clock, Download, MapPin } from "lucide-react"

const deliveryEarnings = [
  {
    id: "DEL-001",
    orderId: "ORD-12345",
    route: "Warehouse A → Site B",
    distance: "25 km",
    amount: 1500,
    status: "completed",
    date: "2024-01-15",
    customer: "ABC Construction",
  },
  {
    id: "DEL-002",
    orderId: "ORD-12346",
    route: "Warehouse C → Site D",
    distance: "18 km",
    amount: 1200,
    status: "pending",
    date: "2024-01-14",
    customer: "XYZ Builders",
  },
]

export default function DistributorPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Delivery Payments</h1>
        <p className="text-muted-foreground">Track your delivery earnings and payment history</p>
      </div>

      {/* Delivery Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,700</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,200</div>
            <p className="text-xs text-muted-foreground">1 delivery pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries Completed</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Delivery History */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deliveryEarnings.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{delivery.route}</p>
                    <p className="text-sm text-muted-foreground">
                      {delivery.customer} • {delivery.distance} • {delivery.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">₹{delivery.amount.toLocaleString()}</p>
                    <Badge variant={delivery.status === "completed" ? "default" : "secondary"}>{delivery.status}</Badge>
                  </div>
                  {delivery.status === "completed" && (
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
