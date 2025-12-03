import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building2, 
  LogOut, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Filter,
  Eye,
  Settings,
  BarChart3,
  Loader2,
  MapPin,
  Calendar
} from "lucide-react";
import { Complaint, CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS, ComplaintStatus } from "@/lib/types";
import { format } from "date-fns";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>("pending");
  const [remarks, setRemarks] = useState("");

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    inProgress: complaints.filter(c => c.status === "in_progress" || c.status === "assigned").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
  };

  const fetchComplaints = async () => {
    try {
      let query = supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

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
    // Check auth
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin");
        return;
      }
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      
      if (!profile || profile.role === "citizen") {
        navigate("/admin");
        return;
      }

      fetchComplaints();
    };
    checkAuth();
  }, [navigate, filterStatus]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const handleStatusUpdate = async () => {
    if (!selectedComplaint) return;
    
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Update complaint status
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      
      if (newStatus === "resolved") {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error: complaintError } = await supabase
        .from("complaints")
        .update(updateData)
        .eq("id", selectedComplaint.id);

      if (complaintError) throw complaintError;

      // Add status update record
      const { error: statusError } = await supabase
        .from("status_updates")
        .insert({
          complaint_id: selectedComplaint.id,
          status: newStatus,
          remarks: remarks || null,
          updated_by: user?.id || null,
        });

      if (statusError) throw statusError;

      toast({
        title: "Status updated",
        description: `Complaint ${selectedComplaint.complaint_id} has been updated to ${STATUS_LABELS[newStatus]}.`,
      });

      setSelectedComplaint(null);
      setRemarks("");
      fetchComplaints();
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Please try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-civic-navy">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold">CivicReport</span>
              <span className="text-xs text-muted-foreground ml-2">Admin Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="h-12 w-12 rounded-lg bg-civic-navy/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-civic-navy" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="h-12 w-12 rounded-lg bg-status-pending/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-status-pending" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="h-12 w-12 rounded-lg bg-status-in-progress/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-status-in-progress" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="h-12 w-12 rounded-lg bg-status-resolved/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-status-resolved" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complaints Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Complaints</CardTitle>
                <CardDescription>Manage and update complaint status</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-civic-teal" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-mono text-sm">{complaint.complaint_id}</TableCell>
                        <TableCell>{CATEGORY_LABELS[complaint.category]}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`priority-${complaint.priority}`}>
                            {PRIORITY_LABELS[complaint.priority]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`status-${complaint.status.replace("_", "-")}`}>
                            {STATUS_LABELS[complaint.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(complaint.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setNewStatus(complaint.status);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {complaints.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No complaints found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>
              ID: {selectedComplaint?.complaint_id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedComplaint && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{CATEGORY_LABELS[selectedComplaint.category]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge variant="outline" className={`priority-${selectedComplaint.priority}`}>
                    {PRIORITY_LABELS[selectedComplaint.priority]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <Badge className={`status-${selectedComplaint.status.replace("_", "-")}`}>
                    {STATUS_LABELS[selectedComplaint.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reported On</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(selectedComplaint.created_at), "PPP")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedComplaint.description}</p>
              </div>

              {selectedComplaint.address && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="text-sm flex items-start gap-1">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    {selectedComplaint.address}
                  </p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="font-medium mb-3">Update Status</p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>New Status</Label>
                    <Select value={newStatus} onValueChange={(v: ComplaintStatus) => setNewStatus(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Remarks (Optional)</Label>
                    <Textarea
                      placeholder="Add notes or remarks..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                  <Button variant="civic" className="w-full" onClick={handleStatusUpdate} disabled={updating}>
                    {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Status"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
