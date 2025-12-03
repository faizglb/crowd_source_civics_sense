import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  FileText, 
  Search, 
  BarChart3, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Building2,
  Users,
  Zap
} from "lucide-react";

const stats = [
  { label: "Total Reports", value: "12,847", icon: FileText, color: "text-civic-navy" },
  { label: "Resolved Issues", value: "10,234", icon: CheckCircle2, color: "text-status-resolved" },
  { label: "In Progress", value: "1,890", icon: Clock, color: "text-status-in-progress" },
  { label: "Avg Resolution", value: "4.2 days", icon: Zap, color: "text-civic-teal" },
];

const features = [
  {
    icon: FileText,
    title: "Report Issues",
    description: "Submit civic issues with text, voice, photos, or videos. Your voice matters.",
    link: "/report",
    linkText: "Report Now",
  },
  {
    icon: MapPin,
    title: "Live Dashboard",
    description: "View all reported issues on an interactive map with real-time status updates.",
    link: "/dashboard",
    linkText: "View Map",
  },
  {
    icon: Search,
    title: "Track Progress",
    description: "Follow your complaint status with a unique tracking ID and timeline view.",
    link: "/track",
    linkText: "Track Complaint",
  },
];

const categories = [
  { name: "Roads & Potholes", icon: "🛣️", count: 3421 },
  { name: "Water Supply", icon: "💧", count: 2156 },
  { name: "Electricity", icon: "⚡", count: 1893 },
  { name: "Sanitation", icon: "🗑️", count: 2834 },
  { name: "Street Lights", icon: "💡", count: 1567 },
  { name: "Others", icon: "📋", count: 976 },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden civic-gradient text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm mb-6 animate-fade-in">
              <Building2 className="h-4 w-4" />
              <span>Municipal Civic Services Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 animate-slide-up">
              Report Civic Issues,{" "}
              <span className="text-[hsl(174,60%,70%)]">Build Better Communities</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Easily report infrastructure problems, track resolution progress, and collaborate 
              with local authorities. Together, we make our city better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/report">
                  <FileText className="h-5 w-5" />
                  Report an Issue
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/dashboard">
                  <MapPin className="h-5 w-5" />
                  View Live Map
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100V30C240 70 480 90 720 70C960 50 1200 0 1440 30V100H0Z" fill="hsl(210 20% 98%)" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-6 relative z-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-2xl md:text-3xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple three-step process to report and track civic issues in your area
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-6 group-hover:bg-civic-teal group-hover:text-white transition-colors">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  <Button variant="ghost" className="p-0 h-auto font-semibold text-civic-teal hover:text-civic-navy" asChild>
                    <Link to={feature.link}>
                      {feature.linkText}
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Issue Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse issues by category to see what's being reported in your community
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Card 
                key={category.name}
                className="group cursor-pointer border-0 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6 text-center">
                  <span className="text-3xl mb-3 block">{category.icon}</span>
                  <h4 className="font-semibold text-sm mb-1 group-hover:text-civic-teal transition-colors">
                    {category.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">{category.count.toLocaleString()} reports</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 civic-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
        <div className="container relative text-center">
          <Users className="h-16 w-16 mx-auto mb-6 text-[hsl(174,60%,70%)]" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Join Thousands of Active Citizens
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Be part of the movement that's transforming how cities respond to civic issues. 
            Your report can make a real difference in your community.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/report">
              Get Started Today
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
