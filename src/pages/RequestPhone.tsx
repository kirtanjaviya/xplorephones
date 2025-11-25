import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Smartphone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const requestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15),
  model_requested: z.string().trim().min(1, "Model name is required").max(200),
  budget: z.number().min(0).optional(),
  message: z.string().trim().max(1000).optional(),
});

const RequestPhone = () => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    model_requested: "",
    budget: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const budgetValue = formData.budget ? parseFloat(formData.budget) : undefined;
      const validated = requestSchema.parse({
        ...formData,
        budget: budgetValue,
      });

      setSubmitting(true);

      const { error } = await supabase.from("specific_requests").insert([{
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        model_requested: validated.model_requested,
        budget: validated.budget || null,
        message: validated.message || null,
      }]);

      if (error) throw error;

      toast({
        title: "Request Submitted!",
        description: "We'll search for your phone and get back to you soon.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        model_requested: "",
        budget: "",
        message: "",
      });
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
          description: "Failed to submit request. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Request a Specific Phone</h1>
            <p className="text-xl text-muted-foreground">
              Can't find the phone you're looking for? Tell us what you need and we'll help you find it!
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fill in Your Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    maxLength={15}
                  />
                </div>

                <div>
                  <Label htmlFor="model_requested">Phone Model You're Looking For *</Label>
                  <Input
                    id="model_requested"
                    placeholder="e.g., iPhone 13 Pro, Samsung Galaxy S21"
                    value={formData.model_requested}
                    onChange={(e) => setFormData({ ...formData, model_requested: e.target.value })}
                    required
                    maxLength={200}
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Your Budget (Optional)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 25000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Additional Details (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Any specific requirements like storage, color, condition, etc."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    maxLength={1000}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Submit Request
                </Button>
              </form>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  We'll review your request and contact you within 24-48 hours if we find a matching phone.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RequestPhone;
