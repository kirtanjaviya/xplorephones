import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/utils/exportExcel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, FileText, Mail, Calendar, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ContactSubmission {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    message: string;
    subject: string | null;
    created_at: string;
}

const AdminContacts = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [contactToDelete, setContactToDelete] = useState<string | null>(null);

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

            await fetchContacts();
        } catch (error) {
            console.error("Auth error:", error);
            navigate("/auth");
        } finally {
            setLoading(false);
        }
    };

    const fetchContacts = async () => {
        const { data, error } = await supabase
            .from("contact_submissions")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast({
                title: "Error",
                description: "Failed to fetch contact messages",
                variant: "destructive",
            });
            return;
        }

        setContacts((data as unknown as ContactSubmission[]) || []);
    };

    const handleExport = () => {
        const data = contacts.map((contact) => ({
            id: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            subject: contact.subject,
            message: contact.message,
            created_at: contact.created_at,
        }));
        exportToExcel(data, "contacts_export");
    };

    const handleDeleteClick = (id: string) => {
        setContactToDelete(id);
        setDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!contactToDelete) return;

        setDeleteConfirm(false);
        try {
            const { error, count } = await supabase
                .from("contact_submissions")
                .delete({ count: "exact" })
                .eq("id", contactToDelete);

            if (error) {
                console.error("Delete error:", error);
                toast({
                    title: "Error",
                    description: error.message || "Failed to delete contact message",
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
                description: "Contact message deleted successfully",
            });

            await fetchContacts();
        } catch (error: any) {
            console.error("Delete exception:", error);
            toast({
                title: "Error",
                description: error.message || "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setContactToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(false);
        setContactToDelete(null);
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
                    <h1 className="text-3xl font-bold mb-2">Contact Messages</h1>
                    <Button variant="outline" onClick={handleExport} className="ml-4">
                        Export to Excel
                    </Button>
                    <p className="text-muted-foreground">
                        View general inquiries from the contact form
                    </p>
                </div>

                {contacts.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No contact messages yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {contacts.map((contact) => (
                            <Card key={contact.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center justify-between">
                                        <span>{contact.name}</span>
                                        <span className="text-sm text-muted-foreground font-normal">
                                            <Calendar className="h-4 w-4 inline mr-1" />
                                            {format(new Date(contact.created_at), "MMM dd, yyyy")}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                        {contact.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                {contact.email}
                                            </div>
                                        )}
                                        {contact.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                {contact.phone}
                                            </div>
                                        )}
                                    </div>
                                    {contact.subject && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Subject:</p>
                                            <p className="text-sm">{contact.subject}</p>
                                        </div>
                                    )}
                                    <div className="bg-muted p-3 rounded-md">
                                        <p className="text-sm">{contact.message}</p>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteClick(contact.id)}
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
                                    Are you sure you want to delete this contact message? This action cannot be undone.
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

export default AdminContacts;
