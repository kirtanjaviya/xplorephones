import { Link } from "react-router-dom";
import { Smartphone, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Smartphone className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Xplore Phones
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted marketplace for quality second-hand smartphones in Surat.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Available Products
                </Link>
              </li>
              <li>
                <Link to="/request" className="text-muted-foreground hover:text-primary transition-colors">
                  Request a Phone
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 9054489461</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>kirtanjaviya102@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Ambika Nagar, Katargam, Surat, 395004</span>
              </li>
            </ul>
          </div>

          {/* Trust Badges */}
          <div>
            <h3 className="font-semibold mb-4">Trust & Transparency</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Verified Devices</li>
              <li>✓ Transparent Pricing</li>
              <li>✓ Quality Assured</li>
              <li>✓ Local Service</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Xplore Phones. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Note: All devices are sold as-is. No warranty provided.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
