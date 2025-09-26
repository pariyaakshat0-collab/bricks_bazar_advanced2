"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Plus, Calendar, FileText, Edit, CheckCircle } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "in-progress" | "completed" | "on-hold"
  budget: number
  spent: number
  startDate: string
  endDate: string
  progress: number
  materials: string[]
  team: string[]
}

export default function PlanningPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Residential Complex - Phase 1",
      description: "Construction of 50 residential units with modern amenities",
      status: "in-progress",
      budget: 2500000,
      spent: 1200000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      progress: 48,
      materials: ["Bricks", "Cement", "Steel", "Sand"],
      team: ["John Contractor", "Site Engineer", "Labor Team"],
    },
    {
      id: "2",
      name: "Commercial Building",
      description: "5-story commercial complex with parking",
      status: "planning",
      budget: 5000000,
      spent: 0,
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      progress: 0,
      materials: ["Concrete", "Steel", "Glass", "Tiles"],
      team: ["Architect", "Structural Engineer"],
    },
    {
      id: "3",
      name: "Warehouse Construction",
      description: "Large storage facility with loading docks",
      status: "completed",
      budget: 1800000,
      spent: 1750000,
      startDate: "2023-06-01",
      endDate: "2023-12-15",
      progress: 100,
      materials: ["Steel Frame", "Roofing", "Concrete"],
      team: ["Project Manager", "Construction Team"],
    },
  ])

  const [showNewProject, setShowNewProject] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
  })

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "planning":
        return "secondary"
      case "in-progress":
        return "default"
      case "completed":
        return "default"
      case "on-hold":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  const handleCreateProject = () => {
    if (newProject.name && newProject.budget) {
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        status: "planning",
        budget: Number.parseInt(newProject.budget),
        spent: 0,
        startDate: newProject.startDate,
        endDate: newProject.endDate,
        progress: 0,
        materials: [],
        team: [],
      }
      setProjects([...projects, project])
      setNewProject({ name: "", description: "", budget: "", startDate: "", endDate: "" })
      setShowNewProject(false)
    }
  }

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{project.name}</CardTitle>
            <p className="text-muted-foreground mt-1">{project.description}</p>
          </div>
          <Badge variant={getStatusColor(project.status)} className="flex items-center gap-1">
            {getStatusIcon(project.status)}
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {/* Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="font-semibold">₹{project.budget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Spent</p>
            <p className="font-semibold">₹{project.spent.toLocaleString()}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Start Date</p>
            <p className="font-semibold">{new Date(project.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">End Date</p>
            <p className="font-semibold">{new Date(project.endDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Materials & Team */}
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Materials</p>
            <div className="flex flex-wrap gap-1">
              {project.materials.map((material, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {material}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Team</p>
            <div className="flex flex-wrap gap-1">
              {project.team.map((member, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {member}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Timeline
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Planning</h1>
          <p className="text-muted-foreground">Manage your construction projects and track progress</p>
        </div>
        <Button onClick={() => setShowNewProject(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* New Project Form */}
      {showNewProject && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Budget (₹)</label>
                <Input
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  placeholder="Enter budget amount"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Project description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateProject}>Create Project</Button>
              <Button variant="outline" onClick={() => setShowNewProject(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({projects.filter((p) => p.status === "in-progress").length})</TabsTrigger>
          <TabsTrigger value="planning">
            Planning ({projects.filter((p) => p.status === "planning").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({projects.filter((p) => p.status === "completed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </TabsContent>

        <TabsContent value="active" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects
            .filter((p) => p.status === "in-progress")
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </TabsContent>

        <TabsContent value="planning" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects
            .filter((p) => p.status === "planning")
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </TabsContent>

        <TabsContent value="completed" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects
            .filter((p) => p.status === "completed")
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
