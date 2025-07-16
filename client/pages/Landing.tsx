import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import {
  Battery,
  BarChart3,
  DollarSign,
  Sun,
  Brain,
  Shield,
  Check,
  ArrowRight,
  TrendingUp,
  Clock,
  Activity,
  Play,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="marketing" />

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-8 bg-brand-teal-50 text-brand-teal-700 border-brand-teal-200 px-4 py-2"
          >
            Advanced Energy Management System
          </Badge>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Smart Energy <span className="text-brand-teal-500">Monitoring</span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Optimize your energy consumption with real-time monitoring,
            predictive analytics, and intelligent battery management. Save money
            while reducing your carbon footprint.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-brand-teal-500 hover:bg-brand-teal-600 text-white px-8 py-4 text-lg"
            >
              Start Monitoring
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-brand-teal-500 mb-2">
                30%
              </div>
              <div className="text-gray-600">Average Energy Savings</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-brand-teal-500 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Real-time Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-brand-teal-500 mb-2">
                99.9%
              </div>
              <div className="text-gray-600">Uptime Monitor</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Energy Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Monitor, analyze and optimize your energy usage with advanced
              tools and real-time insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-brand-teal-100 rounded-lg flex items-center justify-center mb-6">
                  <Battery className="w-6 h-6 text-brand-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Battery Management
                </h3>
                <p className="text-gray-600">
                  Monitor battery power, charge cycles and optimize energy
                  storage for maximum efficiency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-brand-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-brand-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Live Energy Charts
                </h3>
                <p className="text-gray-600">
                  Real-time visualization of PV generation, grid consumption,
                  and load analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cost Savings
                </h3>
                <p className="text-gray-600">
                  Track savings over time and optimize energy costs with
                  intelligent pricing analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                  <Sun className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Solar Integration
                </h3>
                <p className="text-gray-600">
                  Seamless integration with solar panels and renewable energy
                  sources.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Smart Analytics
                </h3>
                <p className="text-gray-600">
                  AI-powered insights and predictive analytics for optimal
                  energy management.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-brand-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-brand-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Secure & Reliable
                </h3>
                <p className="text-gray-600">
                  Enterprise-grade security with 99.9% uptime guarantee and data
                  protection.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Energy Monitoring Dashboard
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get complete visibility into your energy ecosystem with our
              comprehensive monitoring platform.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Battery Power & Energy Price
                      </h3>
                      <p className="text-sm text-gray-600">
                        Real-time performance and energy pricing data
                      </p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-brand-teal-500" />
                  </div>
                  <div className="h-32 bg-gradient-to-r from-brand-teal-50 to-brand-blue-50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-brand-teal-500" />
                    <span className="ml-2 text-gray-600">Battery Chart</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Energy Live Monitor
                      </h3>
                      <p className="text-sm text-gray-600">
                        Live tracking of PV, battery and grid real-time
                      </p>
                    </div>
                    <Activity className="w-5 h-5 text-brand-blue-500" />
                  </div>
                  <div className="h-32 bg-gradient-to-r from-brand-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-brand-blue-500" />
                    <span className="ml-2 text-gray-600">
                      Live Energy Chart
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="font-semibold text-gray-900">
                    Battery Savings Analysis
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Track your savings and ROI over time
                </p>
                <div className="h-24 bg-gradient-to-r from-green-50 to-brand-teal-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <span className="ml-2 text-gray-600">Savings Chart</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose EDIS LAB */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose EDIS LAB?
            </h2>
            <p className="text-xl text-gray-600">
              Industry-leading technology for smart energy management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Reduce Energy Costs
                </h3>
                <p className="text-gray-600">
                  Save up to 30% on your energy bills with intelligent
                  optimization algorithms.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Predictive Analytics
                </h3>
                <p className="text-gray-600">
                  AI-powered forecasting using optimize energy usage and usage
                  patterns.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Real-time Insights
                </h3>
                <p className="text-gray-600">
                  Monitor your energy consumption and generation in real-time
                  with detailed analytics.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  24/7 Support
                </h3>
                <p className="text-gray-600">
                  Expert technical support and system monitoring around the
                  clock.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Easy Integration
                </h3>
                <p className="text-gray-600">
                  Seamlessly integrates with existing solar panels, batteries,
                  and smart home systems.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Scalable Solution
                </h3>
                <p className="text-gray-600">
                  From residential to commercial installations, our solution
                  scales with your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-brand-teal-500 to-brand-blue-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Optimize Your Energy?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start saving money and reducing your carbon footprint today with
            EDIS LAB Monitoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-brand-teal-600 hover:bg-gray-100 px-8 py-4 text-lg"
              asChild
            >
              <Link to="/plants">Get Started Free</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-brand-teal-600 px-8 py-4 text-lg"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="flex flex-col">
                  <span className="font-bold text-brand-teal-500 text-xl leading-none tracking-wide">
                    EDIS LAB
                  </span>
                  <span className="text-brand-blue-400 text-sm leading-none tracking-wide mt-1">
                    Monitoring
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Advanced energy management solutions for a sustainable future.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="#" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 EDIS LAB. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
