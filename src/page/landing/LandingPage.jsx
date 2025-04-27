import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  Package,
  Map,
  Truck,
  Globe,
  ChevronRight,
  Mail,
  CheckCircle,
  Shield,
  Zap,
  BarChart3,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const LandingPage = () => {
  // References for each section
  const topRef = useRef(null);
  const servicesRef = useRef(null);
  const featuresRef = useRef(null);
  const contactRef = useRef(null);
  const aboutRef = useRef(null);
  
  // Function to scroll to a section smoothly
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div ref={topRef} className="flex min-h-screen flex-col bg-background ">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container mx-auto  flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 bg-purple-800 rounded-sm flex items-center justify-center cursor-pointer"
              onClick={scrollToTop}
            >
              <Package className="h-5 w-5 text-white" />
            </div>
            <span 
              className="text-xl font-bold tracking-tight cursor-pointer" 
              onClick={scrollToTop}
            >
              <span className="text-purple-600">Label</span>
              <span className="text-orange-500">Vaults</span>
            </span>
          </div>
          
          <nav className="hidden md:flex gap-6">
            <button 
              onClick={() => scrollToSection(servicesRef)}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection(featuresRef)}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection(contactRef)}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Contact
            </button>
            <button 
              onClick={() => scrollToSection(aboutRef)}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              About
            </button>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="outline" size="sm" className="hidden md:flex cursor-pointer">
                Log In
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white cursor-pointer"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto  px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Ship, Manage, Track, Deliver
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Secure label management solutions that streamline your workflow and enhance delivery security.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/auth/register">
                <Button className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 cursor-pointer">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
                {/* <Button variant="outline" className='cursor-pointer'>Learn More</Button> */}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <Package className="h-16 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} id="services" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto  px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm dark:bg-orange-900">Services</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Services</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                Comprehensive solutions tailored to your shipping needs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                  <Package className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle>Express Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fast and reliable delivery to meet your urgent shipping needs.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="#" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                  <Globe className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle>Global Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Reach customers worldwide with our international shipping solutions.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="#" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                  <Truck className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle>Freight Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Custom logistics and freight solutions for businesses of all sizes.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="#" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto  px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm dark:bg-purple-900">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Choose Us</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                We deliver more than packages - we deliver peace of mind
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
            <Card className="text-center border-none">
              <CardHeader>
                <div className="mx-auto inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4 dark:bg-purple-900">
                  <Globe className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle className="text-lg">Global Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access to worldwide shipping infrastructure and logistics expertise.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none">
              <CardHeader>
                <div className="mx-auto inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4 dark:bg-purple-900">
                  <Search className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle className="text-lg">Real-time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitor your shipments with precise real-time tracking capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none">
              <CardHeader>
                <div className="mx-auto inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4 dark:bg-purple-900">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle className="text-lg">Package Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Additional insurance and security options for valuable shipments.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none">
              <CardHeader>
                <div className="mx-auto inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4 dark:bg-purple-900">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle className="text-lg">Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Express shipping options to meet your time-sensitive requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto  px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex items-center justify-center">
              <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <BarChart3 className="h-16 w-16" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Complete Label Solutions</h2>
                <p className="text-muted-foreground md:text-xl">
                  From creation to delivery, we handle every aspect of your label management needs.
                </p>
              </div>
              
              <ul className="grid gap-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span>Automated label generation and verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span>Seamless integration with existing systems</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span>Real-time tracking and monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span>Customizable workflows and approval processes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span>Comprehensive audit trails and compliance reporting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={aboutRef} id="about" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto  px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm dark:bg-purple-900">Testimonials</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Trusted by Industry Leaders</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                See what our clients have to say about our label management solutions
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Exceptional Service</CardTitle>
                <CardDescription>CTO, Global Logistics Inc.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "LabelVaults has transformed our label management process, saving us countless hours and reducing
                  errors by 95%."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Game Changer</CardTitle>
                <CardDescription>Operations Manager, TechShip Co.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "The security features alone make LabelVaults worth every penny. We've never felt more confident in
                  our label management."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seamless Integration</CardTitle>
                <CardDescription>IT Director, FastTrack Delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "Integrating LabelVaults with our existing systems was surprisingly easy. Their support team was
                  exceptional throughout the process."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section ref={contactRef} id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto  px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm dark:bg-orange-900">Contact Us</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Get Started?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Contact our team today to learn how LabelVaults can transform your label management process.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                  Schedule a Demo
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Sales
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="first-name"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          First name
                        </label>
                        <input
                          id="first-name"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="last-name"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Last name
                        </label>
                        <input
                          id="last-name"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell us about your needs..."
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                    Submit
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto  flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-800 rounded-sm flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold">
              <span className="text-purple-600">Label</span>
              <span className="text-orange-500">Vaults</span>
            </span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2025 LabelVaults. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms
            </Link>
            <Link to="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link to="#" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
