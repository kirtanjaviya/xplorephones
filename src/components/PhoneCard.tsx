import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Battery, HardDrive, Cpu, Circle } from "lucide-react";

interface PhoneCardProps {
  id: string;
  model: string;
  brand: string;
  price: number;
  storage: string;
  ram: string;
  batteryHealth?: number;
  condition: string;
  images: string[];
  isSold: boolean;
}

const PhoneCard = ({
  id,
  model,
  brand,
  price,
  storage,
  ram,
  batteryHealth,
  condition,
  images,
  isSold,
}: PhoneCardProps) => {
  const imageUrl = images[0] || "/placeholder.svg";

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 border-border/50 bg-card">
      <div className="relative overflow-hidden aspect-square bg-muted">
        <img
          src={imageUrl}
          alt={`${brand} ${model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isSold && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="destructive" className="text-base px-6 py-1.5">SOLD</Badge>
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground shadow-sm text-xs font-medium">
          {condition}
        </Badge>
      </div>

      <CardContent className="p-3 space-y-2">
        <div>
          <h3 className="font-semibold text-base truncate text-foreground">{brand} {model}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-foreground">₹{price.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" />
            <span>{storage}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            <span>{ram}</span>
          </div>
          {batteryHealth && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Battery className="h-3 w-3" />
                <span>{batteryHealth}%</span>
              </div>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0">
        <Link to={`/product/${id}`} className="w-full">
          <Button 
            variant={isSold ? "outline" : "default"}
            className="w-full"
            disabled={isSold}
          >
            {isSold ? "Sold Out" : "View Details"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PhoneCard;
