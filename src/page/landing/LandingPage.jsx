import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Package, Map, Truck, Globe, ChevronRight, Menu } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <span className="text-purple-800 font-bold text-2xl">LableVaults</span>
              </div>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/auth/login">
                  <Button variant="outline" className="ml-4 border-purple-800 text-purple-800 hover:bg-purple-50">
                    Log In
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button className="ml-2 bg-purple-800 hover:bg-purple-900 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="icon" className="text-gray-700">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                Ship, Track, and Deliver with Confidence
              </h1>
              <p className="text-lg md:text-xl text-purple-100 mb-8">
                Reliable shipping solutions for your business needs. Fast, secure, and on time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/register">
                  <Button className="bg-white text-purple-900 hover:bg-gray-100 text-lg px-6 py-3 h-auto">
                    Get Started
                  </Button>
                </Link>
                <Button variant="outline" className="border-white text-white hover:bg-purple-800 text-lg px-6 py-3 h-auto">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-2/5">
              {/* Tracking form in a card */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800">
                <Tabs defaultValue="track" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="track">Track</TabsTrigger>
                    <TabsTrigger value="ship">Ship</TabsTrigger>
                  </TabsList>
                  <TabsContent value="track" className="space-y-4">
                    <h3 className="font-semibold text-lg">Track Your Package</h3>
                    <div className="space-y-2">
                      <Input placeholder="Enter tracking number" className="w-full" />
                      <Button className="w-full bg-purple-800 hover:bg-purple-900 text-white">
                        Track Package
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="ship" className="space-y-4">
                    <h3 className="font-semibold text-lg">Create a Shipment</h3>
                    <div className="space-y-2">
                      <Input placeholder="From (Zip Code)" className="w-full" />
                      <Input placeholder="To (Zip Code)" className="w-full" />
                      <Button className="w-full bg-purple-800 hover:bg-purple-900 text-white">
                        Start Shipping
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="mt-4 text-xl text-gray-600">
              Comprehensive solutions tailored to your shipping needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-lg mb-4">
                <Package className="h-8 w-8 text-purple-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Express Shipping</h3>
              <p className="text-gray-600 mb-4">
                Fast and reliable delivery to meet your urgent shipping needs.
              </p>
              <a href="#" className="inline-flex items-center text-purple-800 hover:text-purple-900 font-medium">
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-lg mb-4">
                <Map className="h-8 w-8 text-purple-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Shipping</h3>
              <p className="text-gray-600 mb-4">
                Reach customers worldwide with our international shipping solutions.
              </p>
              <a href="#" className="inline-flex items-center text-purple-800 hover:text-purple-900 font-medium">
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-lg mb-4">
                <Truck className="h-8 w-8 text-purple-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Freight Services</h3>
              <p className="text-gray-600 mb-4">
                Custom logistics and freight solutions for businesses of all sizes.
              </p>
              <a href="#" className="inline-flex items-center text-purple-800 hover:text-purple-900 font-medium">
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="mt-4 text-xl text-gray-600">
              We deliver more than packages - we deliver peace of mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-purple-800 text-white mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Network</h3>
              <p className="text-gray-600">
                Access to worldwide shipping infrastructure and logistics expertise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-purple-800 text-white mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Monitor your shipments with precise real-time tracking capabilities.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-purple-800 text-white mb-4">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Protection</h3>
              <p className="text-gray-600">
                Additional insurance and security options for valuable shipments.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-purple-800 text-white mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Express shipping options to meet your time-sensitive requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-purple-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to ship with us?</h2>
              <p className="text-purple-200">
                Create an account and start shipping today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth/login">
                <Button variant="outline" className="border-white text-white hover:bg-purple-800">
                  Log In
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button className="bg-white text-purple-900 hover:bg-gray-100">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Partners</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Express Shipping</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Global Shipping</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Freight Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Business Solutions</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Tracking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Shipping Calculator</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Shipping Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookies Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;