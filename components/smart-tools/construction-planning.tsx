"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Calendar, CheckCircle, AlertTriangle, Users } from "lucide-react"

const projectPhases = [
  {
    name: "Foundation",
    duration: 15,
    materials: ["Cement", "Steel", "Sand", "Aggregate"],
    laborRequired: 8,
    cost: 250000,
    dependencies: [],
    status: "pending",
  },
  {
    name: "Structure",
    duration: 30,
    materials: ["Cement", "Steel", "Bricks", "Sand"],
    laborRequired: 12,
    cost: 450000,
    dependencies: ["Foundation"],
    status: "pending",
  },
  {
    name: "Walls & Partitions",
    duration: 20,
    materials: ["Bricks", "Cement", "Sand"],
    laborRequired: 10,
    cost: 180000,
    dependencies: ["Structure"],
    status: "pending",
  },
  {
    name: "Roofing",
    duration: 12,
    materials: ["Cement", "Steel", "Tiles"],
    laborRequired: 6,
    cost: 120000,
    dependencies: ["Walls & Partitions"],
    status: "pending",
  },
  {
    name: "Finishing",
    duration: 25,
    materials: ["Paint", "Tiles", "Fixtures"],
    laborRequired: 8,
    cost: 200000,
    dependencies: ["Roofing"],
    status: "pending",
  },
]

export default function ConstructionPlanning() {
  const [projectType, setProjectType] = useState("residential")
  const [projectSize, setProjectSize] = useState("2000")
  const [timeline, setTimeline] = useState("standard")
  const [budget, setBudget] = useState("1200000")

  const totalDuration = projectPhases.reduce((sum, phase) => sum + phase.duration, 0)
  const totalCost = projectPhases.reduce((sum, phase) => sum + phase.cost, 0)
  const totalLaborDays = projectPhases.reduce((sum, phase) => sum + phase.duration * phase.laborRequired, 0)

  const getTimelineMultiplier = () => {
    switch (timeline) {
      case "fast":
        return 0.8
      case "standard":
        return 1.0
      case "relaxed":
        return 1.3
      default:
        return 1.0
    }
  }

  const adjustedDuration = Math.ceil(totalDuration * getTimelineMultiplier())
  const adjustedCost = timeline === "fast" ? totalCost * 1.2 : totalCost

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Customized Construction Planning
        </CardTitle>
        <CardDescription>AI-powered project planning with timeline and resource optimization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Project Type</label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential Building</SelectItem>
                <SelectItem value="commercial">Commercial Building</SelectItem>
                <SelectItem value="industrial">Industrial Structure</SelectItem>
                <SelectItem value="renovation">Renovation Project</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Size (sq ft)</label>
            <Input
              type="number"
              value={projectSize}
              onChange={(e) => setProjectSize(e.target.value)}
              placeholder="Enter size"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Timeline</label>
            <Select value={timeline} onValueChange={setTimeline}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast Track (-20% time, +20% cost)</SelectItem>
                <SelectItem value="standard">Standard Timeline</SelectItem>
                <SelectItem value="relaxed">Relaxed (+30% time, same cost)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Budget (₹)</label>
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter budget"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Total Duration</span>
              </div>
              <p className="text-2xl font-bold">{adjustedDuration} days</p>
              <p className="text-sm text-muted-foreground">≈ {Math.ceil(adjustedDuration / 30)} months</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-600">
                <Building2 className="h-4 w-4" />
                <span className="text-sm font-medium">Estimated Cost</span>
              </div>
              <p className="text-2xl font-bold">₹{(adjustedCost / 100000).toFixed(1)}L</p>
              <p className="text-sm text-muted-foreground">all inclusive</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-600">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Labor Days</span>
              </div>
              <p className="text-2xl font-bold">{totalLaborDays}</p>
              <p className="text-sm text-muted-foreground">total person-days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-purple-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Phases</span>
              </div>
              <p className="text-2xl font-bold">{projectPhases.length}</p>
              <p className="text-sm text-muted-foreground">construction phases</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectPhases.map((phase, index) => {
                  const adjustedPhaseDuration = Math.ceil(phase.duration * getTimelineMultiplier())
                  const startDay = projectPhases
                    .slice(0, index)
                    .reduce((sum, p) => sum + Math.ceil(p.duration * getTimelineMultiplier()), 0)
                  const endDay = startDay + adjustedPhaseDuration

                  return (
                    <div key={phase.name} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{phase.name}</h4>
                        <Badge variant="outline">
                          Day {startDay + 1}-{endDay}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                        <div>
                          <p className="text-muted-foreground">Duration:</p>
                          <p className="font-semibold">{adjustedPhaseDuration} days</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cost:</p>
                          <p className="font-semibold">₹{(phase.cost / 100000).toFixed(1)}L</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">Materials needed:</p>
                        <div className="flex flex-wrap gap-1">
                          {phase.materials.map((material) => (
                            <Badge key={material} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resource Planning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Budget Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Estimated Cost:</span>
                    <span className="font-semibold">₹{(adjustedCost / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Your Budget:</span>
                    <span className="font-semibold">₹{(Number.parseInt(budget) / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Difference:</span>
                    <span
                      className={`font-semibold ${Number.parseInt(budget) >= adjustedCost ? "text-green-600" : "text-red-600"}`}
                    >
                      ₹{Math.abs(Number.parseInt(budget) - adjustedCost).toLocaleString()}
                    </span>
                  </div>
                </div>
                <Progress value={Math.min((adjustedCost / Number.parseInt(budget)) * 100, 100)} className="mt-2" />
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Critical Path Items</h4>
                <div className="space-y-2">
                  {["Foundation approval", "Steel delivery", "Weather dependency"].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Optimization Suggestions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Bulk order materials for 15% savings</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Schedule deliveries to avoid storage costs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Parallel execution can save 10 days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Special Requirements</label>
          <Textarea placeholder="Any specific requirements, constraints, or preferences for your project..." rows={3} />
        </div>

        <div className="flex gap-3">
          <Button className="flex-1">Generate Detailed Plan</Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Save Planning Template
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
