import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhoneCard from "@/components/PhoneCard";
import PhoneFilters from "@/components/PhoneFilters";
import { Loader2 } from "lucide-react";

import SEO from "@/components/SEO";

const Products = () => {
  const [phones, setPhones] = useState<any[]>([]);
  const [filteredPhones, setFilteredPhones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    fetchPhones();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [phones, searchQuery, brandFilter, conditionFilter, priceFilter]);

  const fetchPhones = async () => {
    try {
      const { data, error } = await supabase
        .from("phones")
        .select("*")
        .eq("is_sold", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPhones(data || []);
    } catch (error) {
      console.error("Error fetching phones:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...phones];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (phone) =>
          phone.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          phone.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Brand filter
    if (brandFilter !== "all") {
      result = result.filter((phone) => phone.brand === brandFilter);
    }

    // Condition filter
    if (conditionFilter !== "all") {
      result = result.filter((phone) => phone.condition === conditionFilter);
    }

    // Price filter
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number);
      result = result.filter(
        (phone) => phone.price >= min && phone.price <= max
      );
    }

    setFilteredPhones(result);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Buy Second Hand Phones Under 10k, 15k, 20k in Surat | Xplore Phones"
        description="Looking for second hand phones under 10000? Browse our collection of verified used mobiles. iPhone, Samsung, OnePlus available."
        keywords="Used mobile price list Surat, Second hand mobile market Surat, Buy old phones Surat, phones under 10000, phones under 15000"
        url="/products"
      />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Second Hand Phones for Sale</h1>
          <p className="text-muted-foreground text-lg">
            Browse our collection of quality second-hand smartphones under 10k, 15k, and 20k.
          </p>
        </div>

        <PhoneFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          brandFilter={brandFilter}
          onBrandChange={setBrandFilter}
          conditionFilter={conditionFilter}
          onConditionChange={setConditionFilter}
          priceFilter={priceFilter}
          onPriceChange={setPriceFilter}
        />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : filteredPhones.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No phones found matching your criteria</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredPhones.length} {filteredPhones.length === 1 ? "phone" : "phones"}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhones.map((phone) => (
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
                  images={phone.images}
                  isSold={phone.is_sold}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Products;
