import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  ArrowRight
} from "lucide-react";
import { Complaint, StatusUpdate, CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS } from "@/lib/types";
import { format } from "date-fns";

export default function TrackComplaint() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [searchId, setSearchId] = useState(searchParams.get("id") || "");
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusUpdate[]>([]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!searchId.trim()) {
      toast({
        variant: "destructive",
        title: "Enter tracking ID",
        description: "Please enter a valid complaint tracking ID.",
      });
      return;
    }

    setLoading(true);
    setComplaint(null);
    setStatusHistory([]);

    try {
      // Fetch complaint
      const { data: complaintData, error: complaintError } = await supabase
        .from("complaints")
        .select("*")
        .eq("complaint_id", searchId.trim())
        .maybeSingle();

      if (complaintError) throw complaintError;

      if (!complaintData) {
        toast({
          variant: "destructive",
          title: "Complaint not found",
          description: "No complaint found with this tracking ID.",
        });
        return;
      }

      setComplaint(complaintData);

      // Fetch status history
      const { data: historyData, error: historyError } = await supabase
        .from("status_updates")
        .select("*")
        .eq("complaint_id", complaintData.id)
        .order("created_at", { ascending: true });

      if (historyError) throw historyError;
      setStatusHistory(historyData || []);

    } catch (error: any) {
      console.error("Search error:", error);
      toast({
        variant: "destructive",
        title: "Search failed",
        description: error.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("id")) {
      handleSearch();
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-5 w-5 text-status-pending" />;
      case "assigned":
        return <FileText className="h-5 w-5 text-status-assigned" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-status-in-progress" />;
      case "resolved":
        return <CheckCircle2 className="h-5 w-5 text-status-resolved" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Track Your Complaint</h1>
            <p className="text-muted-foreground">
              Enter your tracking ID to view complaint status and history
            </p>
          </div>

          {/* Search Form */}
          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter Complaint ID (e.g., CMP-20241202-1234)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button type="submit" variant="civic" size="lg" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Complaint Details */}
          {complaint && (
            <div className="space-y-6 animate-fade-in">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardDescription>Tracking ID</CardDescription>
                      <CardTitle className="text-xl font-mono">{complaint.complaint_id}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`status-${complaint.status.replace("_", "-")}`}
                      >
                        {STATUS_LABELS[complaint.status]}
                      </Badge>
                      <Badge variant="outline" className={`priority-${complaint.priority}`}>
                        {PRIORITY_LABELS[complaint.priority]}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{CATEGORY_LABELS[complaint.category]}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Reported On</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(complaint.created_at), "PPP")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm">{complaint.description}</p>
                  </div>

                  {complaint.address && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="text-sm flex items-start gap-1">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        {complaint.address}
                      </p>
                    </div>
                  )}

                  {complaint.expected_resolution_date && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Expected Resolution</p>
                      <p className="font-medium">
                        {format(new Date(complaint.expected_resolution_date), "PPP")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status Timeline */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-civic-teal" />
                    Status History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {statusHistory.map((update, index) => (
                      <div key={update.id} className="flex gap-4 pb-6 last:pb-0">
                        {/* Timeline line */}
                        {index < statusHistory.length - 1 && (
                          <div className="absolute left-[18px] top-8 w-0.5 h-[calc(100%-32px)] bg-muted" />
                        )}
                        
                        {/* Icon */}
                        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background border-2 border-muted">
                          {getStatusIcon(update.status)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{STATUS_LABELS[update.status]}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(update.created_at), "PPp")}
                            </span>
                          </div>
                          {update.remarks && (
                            <p className="text-sm text-muted-foreground">{update.remarks}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {!loading && !complaint && searchId && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No complaint found</p>
              <p className="text-muted-foreground">
                Please check the tracking ID and try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
