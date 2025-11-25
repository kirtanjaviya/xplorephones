import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/utils/exportExcel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, MessageSquare, Mail, Phone, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Inquiry {
    id: string;
    phone_id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    created_at: string;
    phones: {
        brand: string;
        model: string;
    };
}

const AdminInquiries = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [inquiryToDelete, setInquiryToDelete] = useState<string | null>(null);

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

            await fetchInquiries();
        } catch (error) {
            console.error("Auth error:", error);
            navigate("/auth");
        } finally {
            setLoading(false);
        }
    };

    const fetchInquiries = async () => {
        // existing code remains
        const { data, error } = await supabase
            .from("inquiries")
            .select(`
        *,
        phones (brand, model)
      `)
            .order("created_at", { ascending: false });

        if (error) {
            toast({
                title: "Error",
                description: "Failed to fetch inquiries",
                variant: "destructive",
            });
            return;
        }

        setInquiries(data || []);
    };

    const handleExport = () => {
        const data = inquiries.map((inquiry) => ({
            id: inquiry.id,
            name: inquiry.name,
            email: inquiry.email,
            phone: inquiry.phone,
            message: inquiry.message,
            created_at: inquiry.created_at,
            brand: inquiry.phones?.brand,
            model: inquiry.phones?.model,
        }));
        exportToExcel(data, "inquiries_export");
    };

    const handleDeleteClick = (id: string) => {
        setInquiryToDelete(id);
        setDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!inquiryToDelete) return;

        setDeleteConfirm(false);
        try {
            const { error, count } = await supabase
                .from("inquiries")
                .delete({ count: "exact" })
                .eq("id", inquiryToDelete);

            if (error) {
                console.error("Delete error:", error);
                toast({
                    title: "Error",
                    description: error.message || "Failed to delete inquiry",
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
                description: "Inquiry deleted successfully",
            });

            await fetchInquiries();
        } catch (error: any) {
            console.error("Delete exception:", error);
            toast({
                title: "Error",
                description: error.message || "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setInquiryToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(false);
        setInquiryToDelete(null);
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
                    <h1 className="text-3xl font-bold mb-2">Product Inquiries</h1>
                    <Button variant="outline" onClick={handleExport} className="ml-4">
                        Export to Excel
                    </Button>
                    <p className="text-muted-foreground">
                        View and manage customer inquiries about specific phones
                    </p>
                </div>

                {inquiries.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No inquiries yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {inquiries.map((inquiry) => (
                            <Card key={inquiry.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center justify-between">
                                        <span>
                                            {inquiry.phones?.brand} {inquiry.phones?.model}
                                        </span>
                                        <span className="text-sm text-muted-foreground font-normal">
                                            <Calendar className="h-4 w-4 inline mr-1" />
                                            {format(new Date(inquiry.created_at), "MMM dd, yyyy")}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="font-semibold">{inquiry.name}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                {inquiry.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Phone className="h-4 w-4" />
                                                {inquiry.phone}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-muted p-3 rounded-md">
                                        <p className="text-sm">{inquiry.message}</p>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteClick(inquiry.id)}
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
                                    Are you sure you want to delete this inquiry? This action cannot be undone.
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

export default AdminInquiries;
