import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Filter,
  MapPin,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Complaint, CATEGORY_LABELS, STATUS_LABELS } from "@/lib/types";

export default function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showMap, setShowMap] = useState(false);
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{complaints: Complaint[]}> | null>(null);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    inProgress: complaints.filter(c => c.status === "in_progress" || c.status === "assigned").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterCategory !== "all") {
        query = query.eq("category", filterCategory as any);
      }
      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();

    const channel = supabase
      .channel("complaints-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "complaints" },
        () => fetchComplaints()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterCategory, filterStatus]);

  // Load map component dynamically
  useEffect(() => {
    if (showMap && !MapComponent) {
      import("@/components/dashboard/MapView").then((mod) => {
        setMapComponent(() => mod.default);
      });
    }
  }, [showMap, MapComponent]);

  return (
    <Layout hideFooter>
      <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
        {/* Stats Bar */}
        <div className="border-b bg-background/95 backdrop-blur shrink-0">
          <div className="container py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-secondary" />
                <h1 className="text-xl font-display font-bold">Live Issue Map</h1>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="flex items-center gap-2 p-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold">{stats.total}</span>
                    <span className="text-xs text-muted-foreground">Total</span>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="flex items-center gap-2 p-3">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-lg font-bold">{stats.pending}</span>
                    <span className="text-xs text-muted-foreground">Pending</span>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="flex items-center gap-2 p-3">
                    <Clock className="h-4 w-4 text-[hsl(var(--status-in-progress))]" />
                    <span className="text-lg font-bold">{stats.inProgress}</span>
                    <span className="text-xs text-muted-foreground">In Progress</span>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="flex items-center gap-2 p-3">
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--status-resolved))]" />
                    <span className="text-lg font-bold">{stats.resolved}</span>
                    <span className="text-xs text-muted-foreground">Resolved</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b bg-muted/30 shrink-0">
          <div className="container py-3 flex flex-wrap items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => fetchComplaints()}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>

            <div className="ml-auto flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[hsl(var(--status-pending))]" /> Pending
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[hsl(var(--status-in-progress))]" /> In Progress
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[hsl(var(--status-resolved))]" /> Resolved
              </span>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative" style={{ minHeight: "500px" }}>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
          ) : !showMap ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted gap-4">
              <MapPin className="h-16 w-16 text-muted-foreground/50" />
              <p className="text-muted-foreground">Click to load the interactive map</p>
              <Button onClick={() => setShowMap(true)} variant="default">
                Load Map
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                {complaints.length} complaints found
              </p>
            </div>
          ) : MapComponent ? (
            <MapComponent complaints={complaints} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              <span className="ml-2">Loading map...</span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
