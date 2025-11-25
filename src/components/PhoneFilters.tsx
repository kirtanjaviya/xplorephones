import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface PhoneFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  brandFilter: string;
  onBrandChange: (value: string) => void;
  conditionFilter: string;
  onConditionChange: (value: string) => void;
  priceFilter: string;
  onPriceChange: (value: string) => void;
}

const PhoneFilters = ({
  searchQuery,
  onSearchChange,
  brandFilter,
  onBrandChange,
  conditionFilter,
  onConditionChange,
  priceFilter,
  onPriceChange,
}: PhoneFiltersProps) => {
  return (
    <Card className="mb-8 bg-card border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-primary" />
          <span>Filter Phones</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by model..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Select value={brandFilter} onValueChange={onBrandChange}>
              <SelectTrigger id="brand">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                <SelectItem value="Apple">Apple</SelectItem>
                <SelectItem value="Samsung">Samsung</SelectItem>
                <SelectItem value="OnePlus">OnePlus</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Xiaomi">Xiaomi</SelectItem>
                <SelectItem value="Realme">Realme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select value={conditionFilter} onValueChange={onConditionChange}>
              <SelectTrigger id="condition">
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Filter */}
          <div className="space-y-2">
            <Label htmlFor="price">Price Range</Label>
            <Select value={priceFilter} onValueChange={onPriceChange}>
              <SelectTrigger id="price">
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-10000">Under ₹10,000</SelectItem>
                <SelectItem value="10000-20000">₹10,000 - ₹20,000</SelectItem>
                <SelectItem value="20000-30000">₹20,000 - ₹30,000</SelectItem>
                <SelectItem value="30000-50000">₹30,000 - ₹50,000</SelectItem>
                <SelectItem value="50000-999999">Above ₹50,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneFilters;
