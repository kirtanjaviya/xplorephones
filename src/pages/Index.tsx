import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, CheckCircle, TrendingUp, Smartphone, Clock, Award } from "lucide-react";
import PhoneCard from "@/components/PhoneCard";
import heroBanner from "@/assets/hero-banner.jpg";
import SEO from "@/components/SEO";


const Index = () => {
  const [phones, setPhones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhones();
  }, []);

  const fetchPhones = async () => {
    try {
      const { data, error } = await supabase
        .from("phones")
        .select("*")
        .eq("is_sold", false)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setPhones(data);
      }
    } catch (error) {
      console.error("Error fetching phones:", error);
    } finally {
      setLoading(false);
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MobilePhoneStore",
    "name": "Xplore Phones",
    "image": "https://efzkhwcpuvkwmiscjbuj.supabase.co/storage/v1/object/public/phone-images/hero-image.webp",
    "url": "https://xplorephone.store",
    "telephone": "+919054489461",
    "priceRange": "₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ambika Nagar, Katargam",
      "addressLocality": "Surat",
      "postalCode": "395004",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "21.2319",
      "longitude": "72.8363"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "10:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://xplorephone.store"
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://xplorephone.store"
    }]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Buy Second Hand Phones in Surat"
        description="Looking for used smartphones in Surat? Xplore Phones offers verified second-hand iPhones, Samsung, and OnePlus devices with transparent pricing. Buy now!"
        keywords="Second hand phones Surat, Used mobile shop Surat, Refurbished iPhone Surat, Old mobile selling shop near me"
        schema={[localBusinessSchema, breadcrumbSchema]}
      />
      <Navbar />

      <main className="flex-1">
        <Helmet>
          <link
            rel="preload"
            as="image"
            href="https://efzkhwcpuvkwmiscjbuj.supabase.co/storage/v1/object/public/phone-images/hero-image-mobile.webp"
            media="(max-width: 768px)"
          />
          <link
            rel="preload"
            as="image"
            href="https://efzkhwcpuvkwmiscjbuj.supabase.co/storage/v1/object/public/phone-images/hero-image.webp"
            media="(min-width: 769px)"
          />
        </Helmet>
        {/* Hero Section */}
        <section className="relative w-full">
          <Link to="/products" className="block cursor-pointer">
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet="https://efzkhwcpuvkwmiscjbuj.supabase.co/storage/v1/object/public/phone-images/hero-image-mobile.webp"
              />
              <img
                src="https://efzkhwcpuvkwmiscjbuj.supabase.co/storage/v1/object/public/phone-images/hero-image.webp"
                alt="Hero Banner"
                className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
                fetchPriority="high"
              />
            </picture>
          </Link>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Xplore Phones?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We prioritize transparency and quality in every device we offer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center card-lift border-border/50">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Verified Devices</h3>
                  <p className="text-muted-foreground">
                    Every phone is thoroughly checked and verified before listing.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center card-lift border-border/50">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Transparent Pricing</h3>
                  <p className="text-muted-foreground">
                    Clear pricing with all details upfront. No hidden charges.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center card-lift border-border/50">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Best Value</h3>
                  <p className="text-muted-foreground">
                    Quality second-hand phones at competitive prices in Surat.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Buy Second Hand Devices</h2>
              <Link to="/products">
                <Button variant="link" className="text-primary font-medium">
                  View All →
                </Button>
              </Link>
            </div>

            <p className="text-muted-foreground mb-8">
              Browse our collection of quality verified second-hand smartphones
            </p>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {loading ? (
                // Loading state
                [1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="hover:shadow-md transition-shadow border-border/50">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-muted animate-pulse" />
                      <div className="p-3 space-y-2">
                        <div className="h-4 bg-muted animate-pulse rounded" />
                        <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : phones.length > 0 ? (
                // Real phone data using PhoneCard component
                phones.map((phone) => (
                  <PhoneCard
                    key={phone.id}
                    id={phone.id}
                    model={phone.model}
                    brand={phone.brand}
                    price={phone.price}
                    storage={phone.storage}
                    ram={phone.ram}
                    batteryHealth={phone.battery_health}
                    condition={phone.condition}
                    images={phone.images || []}
                    isSold={phone.is_sold}
                  />
                ))
              ) : (
                <div className="col-span-2 md:col-span-3 lg:col-span-5 py-8">
                  <Card className="bg-background border-dashed border-2 border-primary/20 shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center text-center py-12 px-4">
                      <div className="bg-primary/10 p-4 rounded-full mb-6 animate-pulse">
                        <Smartphone className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Stock Currently Empty</h3>
                      <p className="text-muted-foreground max-w-md mb-8 text-lg">
                        Our verified devices sell out quickly! Don't wait - tell us exactly what you're looking for, and we'll arrange it for you.
                      </p>
                      <Link to="/request">
                        <Button size="lg" className="gap-2 text-lg px-8">
                          Request Your Dream Phone
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <Smartphone className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Looking for a Specific Phone?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Can't find what you're looking for? Let us know your requirements and we'll help you find it.
            </p>
            <Link to="/request">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:opacity-90 shadow-lg">
                Request Your Phone
              </Button>
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 bg-muted">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Important Note</p>
            <p>All devices are sold as-is without warranty. We ensure transparency in device condition and specifications.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
