import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, TrendingUp, Users } from "lucide-react";

import SEO from "@/components/SEO";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="About Xplore Phones | Trusted Second Hand Mobile Shop in Surat"
        description="Xplore Phones is Surat's most trusted marketplace for verified second-hand smartphones. We ensure quality, transparency, and best value for used mobiles."
        url="/about"
      />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About Xplore Phones</h1>
            <p className="text-xl text-muted-foreground">
              Your trusted partner for quality second-hand smartphones in Surat
            </p>
          </div>

          <div className="prose max-w-none mb-12">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Xplore Phones was founded with a simple mission: to make quality smartphones accessible
                  to everyone in Surat. We understand that not everyone can afford brand new flagship phones,
                  and that's where we come in.
                </p>
                <p className="text-muted-foreground mb-4">
                  We carefully source, verify, and list second-hand smartphones that offer exceptional value.
                  Every device goes through our rigorous quality check process to ensure you get a phone
                  that works great and lasts long.
                </p>
                <p className="text-muted-foreground">
                  Our commitment to transparency means you'll always know exactly what you're getting -
                  from battery health to minor cosmetic imperfections. No surprises, just honest business.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-8 pb-6">
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Verified Quality</h3>
                <p className="text-muted-foreground">
                  Every phone undergoes thorough testing and verification before listing
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-6">
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Customer First</h3>
                <p className="text-muted-foreground">
                  Your satisfaction and trust are our top priorities
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-6">
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Best Value</h3>
                <p className="text-muted-foreground">
                  Competitive pricing on quality devices you can trust
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-6">
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Local Service</h3>
                <p className="text-muted-foreground">
                  Based in Surat, serving the local community with dedication
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Important Information</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>No Warranty:</strong> All devices are sold as-is without warranty.
                  We provide complete transparency about the condition of each device.
                </p>
                <p>
                  <strong>Quality Assurance:</strong> While we don't offer warranty, we thoroughly
                  test each device to ensure it's in working condition at the time of sale.
                </p>
                <p>
                  <strong>Transparency:</strong> We clearly list all specifications, battery health,
                  and any cosmetic issues so you can make an informed decision.
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

export default About;
