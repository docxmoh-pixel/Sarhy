"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  LayoutDashboard,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Settings,
  Shield,
  Bell,
  FileText,
  AlertTriangle,
  Search,
  Menu,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Server,
  Activity,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageProvider, useLanguage } from "@/lib/language"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: LayoutDashboard, labelAr: "نظرة عامة", labelEn: "Overview", href: "/admin" },
  { icon: Users, labelAr: "المستخدمون", labelEn: "Users", href: "/admin/users" },
  { icon: Package, labelAr: "المنتجات", labelEn: "Products", href: "/admin/products" },
  { icon: DollarSign, labelAr: "المالية", labelEn: "Finance", href: "/admin/finance" },
  { icon: TrendingUp, labelAr: "التحليلات", labelEn: "Analytics", href: "/admin/analytics" },
  { icon: Shield, labelAr: "الأمان", labelEn: "Security", href: "/admin/security" },
  { icon: FileText, labelAr: "التقارير", labelEn: "Reports", href: "/admin/reports" },
  { icon: AlertTriangle, labelAr: "الإشراف", labelEn: "Moderation", href: "/admin/moderation" },
  { icon: Settings, labelAr: "الإعدادات", labelEn: "Settings", href: "/admin/settings" },
]

const overviewStats = [
  { 
    labelAr: "إجمالي الإيرادات", 
    labelEn: "Total Revenue",
    value: "$2.4M",
    change: "+18.2%",
    positive: true,
    icon: DollarSign,
    color: "from-emerald-500 to-green-500"
  },
  { 
    labelAr: "المستخدمون النشطون", 
    labelEn: "Active Users",
    value: "52.4K",
    change: "+12.5%",
    positive: true,
    icon: Users,
    color: "from-blue-500 to-cyan-500"
  },
  { 
    labelAr: "المنتجات المباعة", 
    labelEn: "Products Sold",
    value: "18.2K",
    change: "+8.7%",
    positive: true,
    icon: Package,
    color: "from-violet-500 to-purple-500"
  },
  { 
    labelAr: "طلبات الدعم", 
    labelEn: "Support Tickets",
    value: "234",
    change: "-5.2%",
    positive: true,
    icon: AlertTriangle,
    color: "from-amber-500 to-orange-500"
  },
]

const recentActivity = [
  {
    id: 1,
    type: "user_joined",
    user: "محمد العلي",
    userEn: "Mohammed Ali",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    time: "منذ 5 دقائق",
    timeEn: "5 min ago",
  },
  {
    id: 2,
    type: "product_sold",
    product: "مجموعة أيقونات",
    productEn: "Icon Pack",
    amount: 49,
    time: "منذ 12 دقيقة",
    timeEn: "12 min ago",
  },
  {
    id: 3,
    type: "report",
    report: "بلاغ عن محتوى",
    reportEn: "Content Report",
    time: "منذ 23 دقيقة",
    timeEn: "23 min ago",
  },
  {
    id: 4,
    type: "withdrawal",
    user: "سارة أحمد",
    userEn: "Sara Ahmed",
    amount: 500,
    time: "منذ 45 دقيقة",
    timeEn: "45 min ago",
  },
]

const pendingReviews = [
  {
    id: 1,
    title: "قوالب موشن جرافيك",
    titleEn: "Motion Templates",
    creator: "خالد الفهد",
    creatorEn: "Khalid Alfahd",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
    submitted: "منذ ساعتين",
    submittedEn: "2 hours ago",
  },
  {
    id: 2,
    title: "حزمة خطوط عربية",
    titleEn: "Arabic Fonts Pack",
    creator: "نورة السعيد",
    creatorEn: "Noura Alsaid",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=100&h=100&fit=crop",
    submitted: "منذ 3 ساعات",
    submittedEn: "3 hours ago",
  },
  {
    id: 3,
    title: "أيقونات التجارة",
    titleEn: "Commerce Icons",
    creator: "علي الحربي",
    creatorEn: "Ali Alharbi",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=100&h=100&fit=crop",
    submitted: "منذ 5 ساعات",
    submittedEn: "5 hours ago",
  },
]

const systemHealth = [
  { name: "API", status: "operational", latency: "45ms" },
  { name: "Database", status: "operational", latency: "12ms" },
  { name: "CDN", status: "operational", latency: "8ms" },
  { name: "Storage", status: "degraded", latency: "156ms" },
]

function AdminContent() {
  const { language } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 start-0 h-screen w-64 bg-card border-e border-border z-50 transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : language === "ar" ? "translate-x-full" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold block">
                {language === "ar" ? "صرحي" : "Sarhy"}
              </span>
              <span className="text-xs text-muted-foreground">
                {language === "ar" ? "لوحة الإدارة" : "Admin Panel"}
              </span>
            </div>
          </Link>
          
          {/* Nav Items */}
          <nav className="flex-1 space-y-1">
            {sidebarItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  index === 0 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-secondary"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {language === "ar" ? item.labelAr : item.labelEn}
                </span>
              </Link>
            ))}
          </nav>
          
          {/* Admin Profile */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {language === "ar" ? "عبدالله المدير" : "Abdullah Admin"}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {language === "ar" ? "مدير النظام" : "System Admin"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 glass-strong border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">
                  {language === "ar" ? "نظرة عامة" : "Overview"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "مرحباً بك في لوحة الإدارة" : "Welcome to the admin panel"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={language === "ar" ? "بحث..." : "Search..."}
                  className="w-40 bg-transparent text-sm outline-none"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-destructive" />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div className="p-4 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {overviewStats.map((stat, index) => (
              <motion.div
                key={stat.labelEn}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      stat.positive ? "text-green-500" : "text-red-500"
                    )}>
                      {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === "ar" ? stat.labelAr : stat.labelEn}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">
                    {language === "ar" ? "النشاط الأخير" : "Recent Activity"}
                  </h2>
                  <Button variant="ghost" size="sm">
                    {language === "ar" ? "عرض الكل" : "View All"}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                      {activity.type === "user_joined" && (
                        <>
                          <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <Image src={activity.avatar!} alt="" fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-medium">{language === "ar" ? activity.user : activity.userEn}</span>
                              <span className="text-muted-foreground"> {language === "ar" ? "انضم للمنصة" : "joined the platform"}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {language === "ar" ? activity.time : activity.timeEn}
                            </div>
                          </div>
                          <Users className="w-5 h-5 text-blue-500" />
                        </>
                      )}
                      {activity.type === "product_sold" && (
                        <>
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="text-muted-foreground">{language === "ar" ? "تم بيع" : "Sold"} </span>
                              <span className="font-medium">{language === "ar" ? activity.product : activity.productEn}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {language === "ar" ? activity.time : activity.timeEn}
                            </div>
                          </div>
                          <span className="font-bold text-emerald-500">+${activity.amount}</span>
                        </>
                      )}
                      {activity.type === "report" && (
                        <>
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {language === "ar" ? activity.report : activity.reportEn}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {language === "ar" ? activity.time : activity.timeEn}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            {language === "ar" ? "مراجعة" : "Review"}
                          </Button>
                        </>
                      )}
                      {activity.type === "withdrawal" && (
                        <>
                          <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-violet-500" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-medium">{language === "ar" ? activity.user : activity.userEn}</span>
                              <span className="text-muted-foreground"> {language === "ar" ? "طلب سحب" : "requested withdrawal"}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {language === "ar" ? activity.time : activity.timeEn}
                            </div>
                          </div>
                          <span className="font-bold">${activity.amount}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* System Health */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">
                    {language === "ar" ? "صحة النظام" : "System Health"}
                  </h2>
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                
                <div className="space-y-4">
                  {systemHealth.map((service) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          service.status === "operational" ? "bg-green-500" : "bg-amber-500"
                        )} />
                        <span className="text-sm font-medium">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">{service.latency}</span>
                        {service.status === "operational" ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {language === "ar" ? "وقت التشغيل" : "Uptime"}
                    </span>
                    <span className="font-bold text-green-500">99.98%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Pending Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">
                  {language === "ar" ? "منتجات بانتظار المراجعة" : "Pending Product Reviews"}
                </h2>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                  {pendingReviews.length} {language === "ar" ? "منتجات" : "items"}
                </span>
              </div>
              
              <div className="grid gap-4">
                {pendingReviews.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                      <Image src={product.image} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {language === "ar" ? product.title : product.titleEn}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === "ar" ? `بواسطة ${product.creator}` : `by ${product.creatorEn}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === "ar" ? `تم التقديم ${product.submitted}` : `Submitted ${product.submittedEn}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="default" size="icon" className="bg-green-500 hover:bg-green-600">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon">
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <LanguageProvider>
      <AdminContent />
    </LanguageProvider>
  )
}
