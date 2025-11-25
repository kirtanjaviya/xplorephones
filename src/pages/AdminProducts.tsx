import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, Package, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Phone {
    id: string;
    brand: string;
    model: string;
    price: number;
    condition: string;
    storage: string;
    ram: string;
    images?: string[];
    is_sold: boolean;
    created_at: string;
}

const AdminProducts = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [phones, setPhones] = useState<Phone[]>([]);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [phoneToDelete, setPhoneToDelete] = useState<string | null>(null);

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
            await fetchPhones();
        } catch (error) {
            console.error("Auth error:", error);
            navigate("/auth");
        } finally {
            setLoading(false);
        }
    };

    const fetchPhones = async () => {
        const { data, error } = await supabase
            .from("phones")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            toast({
                title: "Error",
                description: "Failed to fetch phones",
                variant: "destructive",
            });
            return;
        }
        setPhones(data || []);
    };

    const toggleSoldStatus = async (phoneId: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from("phones")
            .update({ is_sold: !currentStatus })
            .eq("id", phoneId);
        if (error) {
            toast({
                title: "Error",
                description: "Failed to update phone status",
                variant: "destructive",
            });
            return;
        }
        toast({
            title: "Success",
            description: `Phone marked as ${!currentStatus ? "sold" : "available"}`,
        });
        await fetchPhones();
    };

    const handleDeleteClick = (phoneId: string) => {
        setPhoneToDelete(phoneId);
        setDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!phoneToDelete) return;
        setDeleteConfirm(false);
        try {
            const { error } = await supabase
                .from("phones")
                .delete()
                .eq("id", phoneToDelete);
            if (error) {
                console.error("Delete error:", error);
                toast({
                    title: "Error",
                    description: error.message || "Failed to delete phone",
                    variant: "destructive",
                });
                return;
            }
            toast({
                title: "Success",
                description: "Phone deleted successfully",
            });
            await fetchPhones();
        } catch (err: any) {
            console.error("Delete exception:", err);
            toast({
                title: "Error",
                description: err.message || "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setPhoneToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(false);
        setPhoneToDelete(null);
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
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" onClick={() => navigate("/admin")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <Button className="bg-gradient-primary" onClick={() => navigate("/admin/add-phone")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Phone
                    </Button>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Manage Products</h1>
                    <p className="text-muted-foreground">
                        View, edit, and manage your phone inventory
                    </p>
                </div>

                {phones.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground mb-4">No phones in inventory</p>
                            <Button className="bg-gradient-primary" onClick={() => navigate("/admin/add-phone")}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Your First Phone
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {phones.map((phone) => (
                            <Card key={phone.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        {phone.images && phone.images.length > 0 && (
                                            <img
                                                src={phone.images[0]}
                                                alt={`${phone.brand} ${phone.model}`}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        {phone.brand} {phone.model}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {phone.storage} • {phone.ram} • {phone.condition}
                                                    </p>
                                                    <p className="text-lg font-bold text-primary mt-2">
                                                        ₹{phone.price.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${phone.is_sold ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                                            }`}
                                                    >
                                                        {phone.is_sold ? "Sold" : "Available"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => toggleSoldStatus(phone.id, phone.is_sold)}
                                                >
                                                    Mark as {phone.is_sold ? "Available" : "Sold"}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteClick(phone.id)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
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
                                    Are you sure you want to delete this phone? This action cannot be undone.
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

export default AdminProducts;
