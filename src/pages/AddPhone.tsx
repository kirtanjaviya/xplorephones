import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const AddPhone = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        model_number: "",
        price: "",
        storage: "",
        ram: "",
        condition: "",
        condition_rating: "",
        color: "",
        battery_health: "",
        description: "",
        delivery_info: "",
        images: "",
        is_negotiable: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Parse images from comma-separated URLs
            const imageArray = formData.images
                .split(",")
                .map((url) => url.trim())
                .filter((url) => url.length > 0);

            const phoneData = {
                brand: formData.brand,
                model: formData.model,
                model_number: formData.model_number || null,
                price: parseFloat(formData.price),
                storage: formData.storage,
                ram: formData.ram,
                condition: formData.condition,
                condition_rating: formData.condition_rating || null,
                color: formData.color || null,
                battery_health: formData.battery_health ? parseInt(formData.battery_health) : null,
                description: formData.description || null,
                delivery_info: formData.delivery_info || null,
                images: imageArray.length > 0 ? imageArray : null,
                is_negotiable: formData.is_negotiable,
                is_sold: false,
            };

            const { error } = await supabase.from("phones").insert([phoneData]);

            if (error) throw error;

            toast({
                title: "Success!",
                description: "Phone added successfully",
            });

            navigate("/admin/products");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to add phone",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-muted">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/admin/products")}
                    className="mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Products
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Add New Phone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Basic Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="brand">Brand *</Label>
                                        <Input
                                            id="brand"
                                            value={formData.brand}
                                            onChange={(e) => handleChange("brand", e.target.value)}
                                            required
                                            placeholder="e.g., Apple, Samsung"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="model">Model *</Label>
                                        <Input
                                            id="model"
                                            value={formData.model}
                                            onChange={(e) => handleChange("model", e.target.value)}
                                            required
                                            placeholder="e.g., iPhone 13 Pro"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="model_number">Model Number</Label>
                                        <Input
                                            id="model_number"
                                            value={formData.model_number}
                                            onChange={(e) => handleChange("model_number", e.target.value)}
                                            placeholder="e.g., A2483"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="price">Price (₹) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => handleChange("price", e.target.value)}
                                            required
                                            placeholder="e.g., 45000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Specifications */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Specifications</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="storage">Storage *</Label>
                                        <Select value={formData.storage} onValueChange={(value) => handleChange("storage", value)} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select storage" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="64GB">64GB</SelectItem>
                                                <SelectItem value="128GB">128GB</SelectItem>
                                                <SelectItem value="256GB">256GB</SelectItem>
                                                <SelectItem value="512GB">512GB</SelectItem>
                                                <SelectItem value="1TB">1TB</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="ram">RAM *</Label>
                                        <Select value={formData.ram} onValueChange={(value) => handleChange("ram", value)} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select RAM" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="4GB">4GB</SelectItem>
                                                <SelectItem value="6GB">6GB</SelectItem>
                                                <SelectItem value="8GB">8GB</SelectItem>
                                                <SelectItem value="12GB">12GB</SelectItem>
                                                <SelectItem value="16GB">16GB</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="color">Color</Label>
                                        <Input
                                            id="color"
                                            value={formData.color}
                                            onChange={(e) => handleChange("color", e.target.value)}
                                            placeholder="e.g., Graphite, Silver"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="battery_health">Battery Health (%)</Label>
                                        <Input
                                            id="battery_health"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.battery_health}
                                            onChange={(e) => handleChange("battery_health", e.target.value)}
                                            placeholder="e.g., 85"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Condition */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Condition</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="condition">Condition *</Label>
                                        <Select value={formData.condition} onValueChange={(value) => handleChange("condition", value)} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select condition" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Excellent">Excellent</SelectItem>
                                                <SelectItem value="Good">Good</SelectItem>
                                                <SelectItem value="Fair">Fair</SelectItem>
                                                <SelectItem value="Like New">Like New</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="condition_rating">Condition Rating</Label>
                                        <Select value={formData.condition_rating} onValueChange={(value) => handleChange("condition_rating", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select rating" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="9/10">9/10</SelectItem>
                                                <SelectItem value="8/10">8/10</SelectItem>
                                                <SelectItem value="7/10">7/10</SelectItem>
                                                <SelectItem value="6/10">6/10</SelectItem>
                                                <SelectItem value="5/10">5/10</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Additional Details</h3>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        placeholder="Describe the phone's features, condition, accessories included, etc."
                                        rows={4}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="delivery_info">Delivery Information</Label>
                                    <Textarea
                                        id="delivery_info"
                                        value={formData.delivery_info}
                                        onChange={(e) => handleChange("delivery_info", e.target.value)}
                                        placeholder="Delivery options, shipping details, etc."
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="images">Image URLs (comma-separated)</Label>
                                    <Textarea
                                        id="images"
                                        value={formData.images}
                                        onChange={(e) => handleChange("images", e.target.value)}
                                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                        rows={3}
                                    />
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Enter image URLs separated by commas
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_negotiable"
                                        checked={formData.is_negotiable}
                                        onCheckedChange={(checked) => handleChange("is_negotiable", checked as boolean)}
                                    />
                                    <Label htmlFor="is_negotiable" className="cursor-pointer">
                                        Price is negotiable
                                    </Label>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        "Add Phone"
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/admin/products")}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddPhone;
