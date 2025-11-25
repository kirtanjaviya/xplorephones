import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Battery, HardDrive, Cpu, Package, Phone, Mail, MessageSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15),
  message: z.string().trim().max(1000).optional(),
});

import SEO from "@/components/SEO";

// ... imports ...

const ProductDetail = () => {
  // ... existing state ...
  const { id } = useParams();
  const [phone, setPhone] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    fetchPhone();
  }, [id]);

  const fetchPhone = async () => {
    try {
      const { data, error } = await supabase
        .from("phones")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPhone(data);
    } catch (error) {
      console.error("Error fetching phone:", error);
    } finally {
      setLoading(false);
    }
  };

  // ... handlers ...
  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = inquirySchema.parse(formData);
      setSubmitting(true);

      const { error } = await supabase.from("inquiries").insert([{
        phone_id: id,
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        message: validated.message || null,
      }]);

      if (error) throw error;

      toast({
        title: "Inquiry Sent!",
        description: "We'll get back to you soon.",
      });

      setDialogOpen(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send inquiry. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in ${phone.brand} ${phone.model} (₹${phone.price})`
    );
    window.open(`https://wa.me/919054489461?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!phone) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Phone not found</h2>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": `${phone.brand} ${phone.model}`,
    "image": phone.images || [],
    "description": `Used ${phone.brand} ${phone.model} in ${phone.condition} condition. Storage: ${phone.storage}, RAM: ${phone.ram}.`,
    "brand": {
      "@type": "Brand",
      "name": phone.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `https://xplorephones.com/product/${phone.id}`,
      "priceCurrency": "INR",
      "price": phone.price,
      "itemCondition": "https://schema.org/UsedCondition",
      "availability": phone.is_sold ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`Buy Used ${phone.brand} ${phone.model} in Surat - ${phone.condition}`}
        description={`Buy second-hand ${phone.brand} ${phone.model} (${phone.storage}) in Surat. ${phone.condition} condition, ${phone.battery_health}% battery health. Verified device at ₹${phone.price}.`}
        keywords={`Second hand ${phone.model} price Surat, Used ${phone.brand} ${phone.model} Surat, ${phone.brand} second hand mobile`}
        image={phone.images?.[0]}
        url={`/product/${phone.id}`}
        schema={productSchema}
      />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={phone.images[selectedImage] || "/placeholder.svg"}
                alt={`${phone.brand} ${phone.model}`}
                className="w-full h-full object-cover"
              />
            </div>
            {phone.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {phone.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImage === idx ? "border-primary" : "border-transparent"
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">
                  {phone.brand} {phone.model}
                </h1>
                {phone.is_sold ? (
                  <Badge variant="destructive" className="text-lg px-4 py-1">SOLD</Badge>
                ) : (
                  <Badge className="bg-gradient-secondary text-secondary-foreground text-lg px-4 py-1">
                    {phone.condition}
                  </Badge>
                )}
              </div>
              <p className="text-4xl font-bold text-primary">₹{phone.price.toLocaleString()}</p>
              {phone.is_negotiable && (
                <p className="text-sm text-muted-foreground mt-1">Price is negotiable</p>
              )}
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Storage</p>
                      <p className="font-semibold">{phone.storage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">RAM</p>
                      <p className="font-semibold">{phone.ram}</p>
                    </div>
                  </div>
                  {phone.battery_health && (
                    <div className="flex items-center gap-2">
                      <Battery className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Battery Health</p>
                        <p className="font-semibold">{phone.battery_health}%</p>
                      </div>
                    </div>
                  )}
                  {phone.color && (
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Color</p>
                        <p className="font-semibold">{phone.color}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {phone.description && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{phone.description}</p>
                </CardContent>
              </Card>
            )}

            {phone.delivery_info && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Delivery Information</h3>
                  <p className="text-muted-foreground">{phone.delivery_info}</p>
                </CardContent>
              </Card>
            )}

            {!phone.is_sold && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Inquire Now</h3>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleWhatsApp}
                    className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us
                  </Button>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Inquiry
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Inquiry</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleInquiry} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            maxLength={100}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            maxLength={255}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            maxLength={15}
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Message (Optional)</Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={4}
                            maxLength={1000}
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={submitting}>
                          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Inquiry"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
