"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Brain, Search, MessageCircle, ArrowRight, ChevronRight, Mail, CheckCircle, 
  Globe, Zap, Target, TrendingUp, Users, Award, Sparkles, Rocket,
  BarChart3, Map, Clock, Star, Play, Compass, Menu, X, Briefcase
} from "lucide-react"
import heroImage from "@/assets/hero-bg.jpg"
import elenaImage from "@/assets/testimonial-elena.jpg"
import davidImage from "@/assets/testimonial-david.jpg"
import { MobileDemo } from "./MobileDemo"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const MobileIndex = () => {
  const [email, setEmail] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Email submitted:", email)
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Mobile Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-xl border-b border-border/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Mobile Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-primary via-accent to-secondary rounded-lg flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Compass className="h-4 w-4 text-white" />
              </motion.div>
            </div>
            <div>
              <span className="font-poppins font-bold text-lg bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Pathfinder
              </span>
            </div>
          </motion.div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/30 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-muted-foreground py-2">Features</a>
              <a href="#vision" className="block text-muted-foreground py-2">Vision</a>
              <a href="#testimonials" className="block text-muted-foreground py-2">Success Stories</a>
              <Button className="w-full bg-gradient-to-r from-primary to-accent text-white mt-4">
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Mobile Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center pt-16">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe 
            allow="fullscreen;autoplay" 
            allowFullScreen 
            src="https://streamable.com/e/peqv3j?autoplay=1&nocontrols=1&muted=1" 
            className="absolute inset-0 w-full h-full"
            style={{
              border: 'none',
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: '0px',
              top: '0px',
              overflow: 'hidden',
              transform: 'scale(1.1)', // Slight scale to ensure full coverage on mobile
              transformOrigin: 'center center'
            }}
            title="Hero Background Video"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/65 to-background/75" />
        
        {/* Mobile Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-4 w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-xl border border-primary/30 flex items-center justify-center"
            animate={{ y: [0, -15, 0], rotate: [0, 180, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Brain className="h-6 w-6 text-primary" />
          </motion.div>

          <motion.div
            className="absolute top-32 right-4 w-14 h-14 bg-secondary/20 backdrop-blur-sm rounded-full border border-secondary/30 flex items-center justify-center"
            animate={{ x: [0, 10, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <Globe className="h-7 w-7 text-secondary" />
          </motion.div>

          <motion.div
            className="absolute bottom-40 left-4 w-10 h-10 bg-accent/20 backdrop-blur-sm rounded-lg border border-accent/30 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Target className="h-5 w-5 text-accent" />
          </motion.div>
        </div>

        <div className="relative container mx-auto px-4 py-12">
          <motion.div
            className="text-center"
            initial="initial"
            animate="animate"
          >
            {/* Mobile Badge */}
            <motion.div
              className="inline-flex items-center bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-primary/20"
              variants={fadeInUp}
            >
              <motion.div
                className="w-2 h-2 bg-primary rounded-full mr-2"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-primary">AI Career Engine</span>
            </motion.div>
            
            {/* Mobile Headline */}
            <motion.h1 
              className="font-poppins font-bold text-3xl mb-4 text-foreground leading-tight"
              variants={fadeInUp}
            >
              Discover Your
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Perfect Career
              </span>
            </motion.h1>
            
            {/* Mobile Description */}
            <motion.p 
              className="text-base text-muted-foreground mb-8 leading-relaxed px-2"
              variants={fadeInUp}
            >
              AI analyzes 50M+ global opportunities to build your personalized roadmap to success.
            </motion.p>

            {/* Mobile Action Buttons */}
            <motion.div
              className="flex flex-col gap-3 mb-10"
              variants={fadeInUp}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 py-4 rounded-2xl w-full"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 rounded-2xl w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Mobile Stats */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={fadeInUp}
            >
              {[
                { value: "50M+", label: "Opportunities" },
                { value: "195", label: "Countries" },
                { value: "92%", label: "Success Rate" },
                { value: "24/7", label: "AI Support" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-3 rounded-xl bg-gradient-to-br from-background to-muted/20 border border-border/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mobile Demo Section */}
      <section className="py-16 bg-gradient-to-b from-muted/10 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins font-bold text-2xl mb-4 text-foreground">
              Experience the Power
            </h2>
            <p className="text-muted-foreground">
              See how our AI finds global opportunities for your career
            </p>
          </motion.div>
          
          <MobileDemo />
        </div>
      </section>

      {/* Mobile Vision Section */}
      <section id="vision" className="py-16 bg-gradient-to-b from-muted/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-secondary/10 text-secondary rounded-full px-4 py-2 mb-4">
              <Globe className="h-4 w-4 mr-2" />
              <span className="text-xs font-medium">Beyond Learning</span>
            </div>
            <h2 className="font-poppins font-bold text-2xl mb-4">
              Your Personal AI Life Architect
            </h2>
            <p className="text-muted-foreground text-sm">
              Pathfinder analyzes every possible path to find the absolute best route for any professional goal
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                icon: Target,
                title: "Academic Institutions",
                description: "Best universities, programs, and scholarships worldwide",
                color: "primary"
              },
              {
                icon: Award,
                title: "Vocational Training",
                description: "Bootcamps, certifications, and trade schools",
                color: "secondary"
              },
              {
                icon: TrendingUp,
                title: "Career Placements",
                description: "Real-time job market data across global markets",
                color: "accent"
              },
              {
                icon: Globe,
                title: "International Mobility",
                description: "Relocation support and global opportunities",
                color: "primary"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-card border border-border/50"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-10 h-10 bg-${feature.color}/10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className={`h-5 w-5 text-${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins font-bold text-2xl mb-4">
              How Pathfinder Works
            </h2>
            <p className="text-muted-foreground">
              Our AI scouts the globe for your perfect opportunities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Brain,
                title: "AI Analysis",
                description: "Intelligent skill & goal matching"
              },
              {
                icon: Search,
                title: "Global Search",
                description: "50M+ opportunities worldwide"
              },
              {
                icon: Map,
                title: "Personalized Roadmap",
                description: "Custom path to your goals"
              },
              {
                icon: Rocket,
                title: "Success Tracking",
                description: "Progress monitoring & support"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-4 rounded-xl bg-gradient-card border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Testimonials */}
      <section id="testimonials" className="py-16 bg-gradient-to-b from-muted/10 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins font-bold text-2xl mb-4">
              Success Stories
            </h2>
            <p className="text-muted-foreground">
              Real people, real transformations
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                name: "Elena Rodriguez",
                role: "Data Scientist at Google",
                image: elenaImage,
                quote: "Pathfinder found me the perfect AI bootcamp that led directly to my dream job."
              },
              {
                name: "David Chen",
                role: "Software Engineer in Berlin",
                image: davidImage,
                quote: "From zero coding experience to working in Europe - all thanks to Pathfinder's guidance."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gradient-card rounded-2xl p-6 border border-border/50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-muted-foreground mb-3 text-sm italic">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center space-y-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins font-bold text-2xl text-foreground">
              Ready to Transform Your Career?
            </h2>
            <p className="text-muted-foreground">
              Join thousands discovering their perfect path
            </p>
            
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl py-3"
              />
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 rounded-2xl"
              >
                Get Early Access
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Mobile Footer */}
      <footer className="bg-muted/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Compass className="h-3 w-3 text-white" />
            </div>
            <span className="font-poppins font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pathfinder
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 Pathfinder AI. Empowering careers globally.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default MobileIndex