import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/utils/exportExcel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Smartphone, Mail, Phone, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface PhoneRequest {
    id: string;
    name: string;
    email: string;
    phone: string;
    model_requested: string;
    budget: number | null;
    message: string | null;
    created_at: string;
}

const AdminRequests = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<PhoneRequest[]>([]);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

    useEffect(() => {
        checkAuthAndFetch();
    }, []);

    const checkAuthAndFetch = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                navigate("/auth");
                return;
            }

            const { data: roles } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", session.user.id)
                .eq("role", "admin")
                .maybeSingle();

            if (!roles) {
                toast({
                    title: "Access Denied",
                    description: "You don't have admin privileges.",
                    variant: "destructive",
                });
                navigate("/");
                return;
            }

            await fetchRequests();
        } catch (error) {
            console.error("Auth error:", error);
            navigate("/auth");
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        const { data, error } = await supabase
            .from("specific_requests")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast({
                title: "Error",
                description: "Failed to fetch phone requests",
                variant: "destructive",
            });
            return;
        }

        setRequests(data || []);
    };

    const handleExport = () => {
        const data = requests.map((req) => ({
            id: req.id,
            name: req.name,
            email: req.email,
            phone: req.phone,
            model_requested: req.model_requested,
            budget: req.budget,
            message: req.message,
            created_at: req.created_at,
        }));
        exportToExcel(data, "requests_export");
    };

    const handleDeleteClick = (id: string) => {
        setRequestToDelete(id);
        setDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!requestToDelete) return;

        setDeleteConfirm(false);
        try {
            const { error, count } = await supabase
                .from("specific_requests")
                .delete({ count: "exact" })
                .eq("id", requestToDelete);

            if (error) {
                console.error("Delete error:", error);
                toast({
                    title: "Error",
                    description: error.message || "Failed to delete request",
                    variant: "destructive",
                });
                return;
            }

            if (count === 0) {
                console.error("Delete failed: No rows deleted. Check RLS policies.");
                toast({
                    title: "Delete Failed",
                    description: "Item could not be deleted. You might not have permission.",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Success",
                description: "Request deleted successfully",
            });

            await fetchRequests();
        } catch (error: any) {
            console.error("Delete exception:", error);
            toast({
                title: "Error",
                description: error.message || "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setRequestToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(false);
        setRequestToDelete(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted">
            <div className="container mx-auto px-4 py-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/admin")}
                    className="mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Phone Requests</h1>
                    <Button variant="outline" onClick={handleExport} className="ml-4">
                        Export to Excel
                    </Button>
                    <p className="text-muted-foreground">
                        View customer requests for specific phones
                    </p>
                </div>

                {requests.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Smartphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No phone requests yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {requests.map((request) => (
                            <Card key={request.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center justify-between">
                                        <span>{request.model_requested}</span>
                                        <span className="text-sm text-muted-foreground font-normal">
                                            <Calendar className="h-4 w-4 inline mr-1" />
                                            {format(new Date(request.created_at), "MMM dd, yyyy")}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="font-semibold">{request.name}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                {request.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Phone className="h-4 w-4" />
                                                {request.phone}
                                            </span>
                                        </div>
                                    </div>
                                    {request.budget && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Budget</p>
                                            <p className="font-medium">₹{request.budget.toLocaleString()}</p>
                                        </div>
                                    )}
                                    {request.message && (
                                        <div className="bg-muted p-3 rounded-md">
                                            <p className="text-sm font-medium mb-1">Additional Details:</p>
                                            <p className="text-sm">{request.message}</p>
                                        </div>
                                    )}
                                    <div className="flex justify-end mt-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteClick(request.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="w-full max-w-md mx-4">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
                                <p className="text-muted-foreground mb-4">
                                    Are you sure you want to delete this request? This action cannot be undone.
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <Button variant="outline" onClick={cancelDelete}>
                                        Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={confirmDelete}>
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminRequests;
