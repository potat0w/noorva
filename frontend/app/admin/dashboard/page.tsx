"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ShoppingCart, Package, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalUsers: number
  totalOrders: number
  totalProducts: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (!token) return

        const [usersRes, ordersRes, productsRes] = await Promise.all([
          fetch('/api/users', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('/api/products', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        const users = await usersRes.json()
        const orders = await ordersRes.json()
        const products = await productsRes.json()

        const totalRevenue = orders.reduce((sum: number, order: any) => 
          sum + (order.total_amount || 0), 0)

        setStats({
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalOrders: Array.isArray(orders) ? orders.length : 0,
          totalProducts: Array.isArray(products) ? products.length : 0,
          totalRevenue
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/users'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/orders'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/admin/products'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/admin/orders'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Link key={index} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/users">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium">Manage Users</h3>
                <p className="text-sm text-gray-600">View, edit, and delete user accounts</p>
              </div>
            </Link>
            <Link href="/admin/products">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium">Manage Products</h3>
                <p className="text-sm text-gray-600">Add, edit, and remove products</p>
              </div>
            </Link>
            <Link href="/admin/orders">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium">Manage Orders</h3>
                <p className="text-sm text-gray-600">View and update order status</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              <p>Activity feed coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
