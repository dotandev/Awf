"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  Mic,
  FileText,
  Globe,
  Zap,
  Lock,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  MapPin,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  const languages = {
    en: {
      title: "Secure Digital Agreements for Everyone",
      subtitle: "Record, verify, and enforce agreements on the blockchain - no bank account required",
      getStarted: "Get Started",
      learnMore: "Learn More",
      features: "Features",
      howItWorks: "How It Works",
      testimonials: "What People Say",
      stats: "Trusted Across Nigeria",
    },
    ha: {
      title: "Amintattun Yarjejeniyoyin Dijital don Kowa",
      subtitle: "Rubuta, tabbatar, da aiwatar da yarjejeniyoyi akan blockchain - babu buƙatar asusun banki",
      getStarted: "Fara",
      learnMore: "Koyi Ƙari",
      features: "Fasaloli",
      howItWorks: "Yadda Yake Aiki",
      testimonials: "Abin da Mutane Suke Cewa",
      stats: "An Amince da shi A Duk Najeriya",
    },
    yo: {
      title: "Awọn Adehun Oni-nọmba Ti O Ni Aabo Fun Gbogbo Eniyan",
      subtitle: "Gbasilẹ, jẹrisi, ati fi agbara mu awọn adehun lori blockchain - ko nilo akọọlẹ ile-ifowopamọ",
      getStarted: "Bẹrẹ",
      learnMore: "Kọ Diẹ Sii",
      features: "Awọn Ẹya",
      howItWorks: "Bi O Ṣe N Ṣiṣẹ",
      testimonials: "Ohun Ti Awọn Eniyan N Sọ",
      stats: "Igbẹkẹle Jakejado Naijiria",
    },
    ig: {
      title: "Nkwekọrịta Dijitalụ Echekwara Maka Onye Ọbụla",
      subtitle: "Dekọọ, kwado, ma mee ka nkwekọrịta na blockchain - enweghị mkpa akọọntụ ụlọ akụ",
      getStarted: "Malite",
      learnMore: "Mụtakwuo",
      features: "Atụmatụ",
      howItWorks: "Otú Ọ Na-arụ Ọrụ",
      testimonials: "Ihe Ndị Mmadụ Na-ekwu",
      stats: "Ntụkwasị Obi N'ofe Naịjirịa",
    },
  }

  const t = languages[selectedLanguage as keyof typeof languages]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Agreement Ledger</span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-sm border rounded-md px-2 py-1 bg-white"
              >
                <option value="en">English</option>
                <option value="ha">Hausa</option>
                <option value="yo">Yoruba</option>
                <option value="ig">Igbo</option>
              </select>

              <Link href="/">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-green-100 text-green-800 px-3 py-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  Made for Nigeria
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">{t.title}</h1>
                <p className="text-xl text-gray-600 leading-relaxed">{t.subtitle}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                    {t.getStarted}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                  <Play className="w-5 h-5 mr-2" />
                  {t.learnMore}
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Blockchain Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Zero-Knowledge Privacy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-gray-600">Low Cost</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Demo */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Sample Agreement</h3>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mic className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-600">Audio Agreement in Hausa</span>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500">Recording: 2:34</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Amount: ₦50,000</span>
                      <span className="text-green-600 font-medium">2 parties signed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-600 text-white p-3 rounded-full shadow-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.stats}</h2>
            <p className="text-gray-600">Empowering communities across Nigeria with secure digital agreements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Agreements Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">36</div>
              <div className="text-gray-600">States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">₦2.5B</div>
              <div className="text-gray-600">Value Secured</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.features}</h2>
            <p className="text-xl text-gray-600">Built for Nigeria's unique needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Audio Agreements</CardTitle>
                <CardDescription>
                  Record agreements in your local language - perfect for oral traditions common in Nigerian communities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Zero-Knowledge Privacy</CardTitle>
                <CardDescription>
                  Verify your identity without revealing personal information - using biometric proofs and community
                  attestation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>No Bank Account Needed</CardTitle>
                <CardDescription>
                  Designed for the unbanked - use community verification and simplified wallet creation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>Ultra-Low Fees</CardTitle>
                <CardDescription>
                  Powered by Sui blockchain with fees as low as $1 per transaction - affordable for everyone
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Multilingual Support</CardTitle>
                <CardDescription>
                  Available in English, Hausa, Yoruba, and Igbo - making it accessible to all Nigerians
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Legal Compliance</CardTitle>
                <CardDescription>
                  Designed to work within Nigerian legal framework with verifiable digital signatures
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.howItWorks}</h2>
            <p className="text-xl text-gray-600">Simple steps to secure your agreements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Agreement</h3>
              <p className="text-gray-600">
                Record your agreement terms in text or audio format. Add all parties involved and specify the terms.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Verify & Sign</h3>
              <p className="text-gray-600">
                All parties verify their identity using zero-knowledge proofs and digitally sign the agreement.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure & Enforce</h3>
              <p className="text-gray-600">
                Agreement is stored on blockchain with verifiable playback for authorized parties and arbitrators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t.testimonials}</h2>
            <p className="text-xl opacity-90">Real stories from Nigerian users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic">
                  "As a small business owner in Lagos, this platform helped me secure a ₦100,000 loan agreement with
                  clear terms. The audio recording in Yoruba made it perfect for my community."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Adunni Okafor</div>
                    <div className="text-sm opacity-75">Small Business Owner, Lagos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic">
                  "The zero-knowledge verification is amazing! I could prove my identity without sharing personal
                  documents. Perfect for our rural community in Kano."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Musa Ibrahim</div>
                    <div className="text-sm opacity-75">Farmer, Kano</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic">
                  "Finally, a platform that understands Nigerian culture! The community attestation feature helped me
                  get verified without formal ID documents."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Chioma Nwankwo</div>
                    <div className="text-sm opacity-75">Trader, Enugu</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Agreements?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of Nigerians who trust Agreement Ledger for their important contracts
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                Start Creating Agreements
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 bg-transparent"
            >
              Contact Support
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              24/7 Support
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Bank-Level Security
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              Instant Verification
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Agreement Ledger</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering Nigerian communities with secure, accessible digital agreements on the blockchain.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Agreement Ledger. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <span className="text-gray-400 text-sm">Powered by Sui Blockchain</span>
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
