"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAdminAuthenticated, useAdminAuth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import AdminNavigation from "@/components/ui/admin-navigation"

interface Location {
  id: number
  name: string
  address: string
  createdAt: string
  lastUsed: string
}

export default function LocationsPage() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAdminAuth()
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  })

  // Check authentication on component mount
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
      return
    }
  }, [router])

  // Fetch locations
  useEffect(() => {
    if (isAdminAuthenticated()) {
      fetchLocations()
    }
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setLocations(data)
      } else {
        console.error('Failed to fetch locations')
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingLocation ? `/api/locations/${editingLocation.id}` : '/api/locations'
      const method = editingLocation ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchLocations()
        resetForm()
        alert(editingLocation ? 'Location updated successfully!' : 'Location created successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to ${editingLocation ? 'update' : 'create'} location: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving location:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleEdit = (location: Location) => {
    setEditingLocation(location)
    setFormData({
      name: location.name,
      address: location.address,
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this location?')) {
      return
    }

    try {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        await fetchLocations()
        alert('Location deleted successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to delete location: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting location:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({ name: "", address: "" })
    setEditingLocation(null)
    setShowCreateForm(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation currentPage="/admin/locations" onLogout={logout} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Location Management</h1>
            <p className="text-gray-600 mt-2">Manage training locations for your sessions</p>
          </div>
          
          <Button onClick={() => setShowCreateForm(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Location Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Robe Sports Complex"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g., 123 Main St, City, State 12345"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    {editingLocation ? 'Update Location' : 'Create Location'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Locations List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading locations...</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No locations found.</p>
            <Button onClick={() => setShowCreateForm(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Location
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <Card key={location.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent p-2"
                        onClick={() => handleEdit(location)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent p-2"
                        onClick={() => handleDelete(location.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-4">{location.address}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Created:</span> {formatDate(location.createdAt)}
                    </div>
                    {location.lastUsed && (
                      <div>
                        <span className="font-medium">Last Used:</span> {formatDate(location.lastUsed)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}