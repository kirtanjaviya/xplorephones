import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Smartphone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Request a Phone", path: "/request" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Smartphone className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Xplore Phones
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Mobiles</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            to="/products"
                          >
                            <Smartphone className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              All Phones
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Browse our complete collection of verified second-hand smartphones.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <Link to="/mobiles/brand/apple" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Apple iPhones</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Verified used iPhones
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/mobiles/brand/samsung" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Samsung Mobiles</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Galaxy S & A series
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/mobiles/price/under-15000" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Under ₹15,000</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Budget friendly options
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/request">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Request Phone
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      About Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/contact">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block"
              >
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${isActive(link.path) ? "text-primary font-medium" : ""
                    }`}
                >
                  {link.name}
                </Button>
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              <p className="px-4 text-sm font-semibold text-muted-foreground mb-2">Categories</p>
              <Link to="/mobiles/brand/apple" onClick={() => setIsOpen(false)} className="block">
                <Button variant="ghost" className="w-full justify-start pl-8">Apple iPhones</Button>
              </Link>
              <Link to="/mobiles/brand/samsung" onClick={() => setIsOpen(false)} className="block">
                <Button variant="ghost" className="w-full justify-start pl-8">Samsung</Button>
              </Link>
              <Link to="/mobiles/price/under-15000" onClick={() => setIsOpen(false)} className="block">
                <Button variant="ghost" className="w-full justify-start pl-8">Under 15k</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
