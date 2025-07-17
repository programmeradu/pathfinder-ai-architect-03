"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useDevice } from "@/hooks/use-device"
import MobileIndex from "@/components/mobile/MobileIndex"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Brain, Search, MessageCircle, ArrowRight, ChevronRight, Mail, CheckCircle, 
  Globe, Target, TrendingUp, Users, Award, Sparkles, Rocket,
  BarChart3, Map, Clock, Star, Play, Compass, Moon, Sun, Zap
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import heroImage from "@/assets/hero-bg.jpg"
import elenaImage from "@/assets/testimonial-elena.jpg"
import davidImage from "@/assets/testimonial-david.jpg"
// import { InteractiveDemo } from "@/components/InteractiveDemo"
import { EnhancedDemo } from "@/components/EnhancedDemo"

const Index = () => {
  const [email, setEmail] = useState("")
  const { isMobile } = useDevice()

  // Return mobile version for mobile devices
  if (isMobile) {
    return <MobileIndex />
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Email submitted:", email)
    // Handle email submission logic here
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Premium Navigation Bar */}
      <motion.nav 
        className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-xl border-b border-border/30 shadow-elegant"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          {/* Enhanced Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl flex items-center justify-center shadow-glow"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Compass className="h-6 w-6 text-white" />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <span className="font-poppins font-bold text-2xl bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Pathfinder
              </span>
              <div className="text-xs text-muted-foreground font-medium tracking-wider">
                AI CAREER ENGINE
              </div>
            </div>
          </motion.div>

          {/* Enhanced Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <motion.a 
                href="#features" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group"
                whileHover={{ y: -1 }}
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
              <motion.a 
                href="#vision" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group"
                whileHover={{ y: -1 }}
              >
                Vision
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
              <motion.a 
                href="#testimonials" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group"
                whileHover={{ y: -1 }}
              >
                Success Stories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" asChild>
                  <a href="/auth">Login</a>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-gradient-to-r from-primary to-accent text-white font-semibold px-6 py-2 rounded-xl shadow-glow border-0 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <Sparkles className="h-4 w-4 ml-2" />
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center pt-20">
        {/* Video Background */}
        <div className="absolute inset-0">
          <div style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0}}>
            <iframe 
              allow="fullscreen;autoplay" 
              allowFullScreen 
              height="100%" 
              src="https://streamable.com/e/peqv3j?autoplay=1&nocontrols=1&muted=1&loop=1" 
              width="100%" 
              style={{
                border: 'none', 
                width: '100%', 
                height: '100%', 
                position: 'absolute', 
                left: '0px', 
                top: '0px', 
                overflow: 'hidden',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/65 to-background/75" />

        {/* Floating UI Components */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* AI Brain Node */}
          <motion.div
            className="absolute top-20 left-10 w-16 h-16 bg-primary/20 backdrop-blur-sm rounded-2xl border border-primary/30 flex items-center justify-center"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <Brain className="h-8 w-8 text-primary" />
          </motion.div>

          {/* Search Globe */}
          <motion.div
            className="absolute top-32 right-20 w-20 h-20 bg-secondary/20 backdrop-blur-sm rounded-full border border-secondary/30 flex items-center justify-center"
            animate={{ 
              x: [0, 15, 0],
              y: [0, -25, 0],
              rotate: [0, -360]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <Globe className="h-10 w-10 text-secondary" />
          </motion.div>

          {/* Career Target */}
          <motion.div
            className="absolute bottom-40 left-20 w-14 h-14 bg-accent/20 backdrop-blur-sm rounded-xl border border-accent/30 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Target className="h-7 w-7 text-accent" />
          </motion.div>

          {/* Floating Data Cards */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-8 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm rounded-lg border border-white/10"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                delay: i * 1.5
              }}
            >
              <div className="flex items-center p-2 space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <div className="flex-1 h-1 bg-gradient-to-r from-primary/50 to-transparent rounded" />
              </div>
            </motion.div>
          ))}

          {/* Network Connection Lines */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.path
              d="M 100 200 Q 300 100 500 250 T 800 200"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
              strokeDasharray="5,5"
              animate={{ strokeDashoffset: [0, 20] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M 200 400 Q 400 300 600 450 T 900 400"
              stroke="hsl(var(--secondary))"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
              strokeDasharray="8,8"
              animate={{ strokeDashoffset: [0, 32] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-center lg:text-left"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Compact Badge */}
              <motion.div
                className="inline-flex items-center bg-primary/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-primary/20"
                variants={fadeInUp}
              >
                <motion.div
                  className="w-2 h-2 bg-primary rounded-full mr-3"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-primary">AI-Powered Global Career Engine</span>
              </motion.div>

            {/* Clean Headline */}
            <motion.h1 
              className="font-poppins font-bold text-4xl md:text-6xl lg:text-7xl mb-6 text-foreground leading-tight"
              variants={fadeInUp}
            >
              Discover Your Perfect
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Career Path
              </span>
            </motion.h1>

            {/* Concise Description */}
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
              variants={fadeInUp}
            >
              AI analyzes 50M+ global opportunities across universities, training programs, 
              jobs, and relocations to build your personalized roadmap to success.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              variants={fadeInUp}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-8 py-3 rounded-full shadow-elegant"
              >
                <span className="flex items-center">
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 ml-2" />
                </span>
              </Button>

              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-3 rounded-full"
              >
                <span className="flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </span>
              </Button>
            </motion.div>

            {/* Compact Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
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
                  className="text-center p-4 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-secondary/10 text-secondary rounded-full px-6 py-2 mb-6">
              <Globe className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Beyond Learning</span>
            </div>
            <h2 className="font-poppins font-bold text-4xl md:text-6xl mb-6 text-foreground">
              Your Personal AI Life Architect
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Pathfinder analyzes every possible path—academic, vocational, experiential, and international—to find 
              the absolute best route for any professional goal.
            </p>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <motion.div 
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-xl mb-2">Academic Institutions</h3>
                  <p className="text-muted-foreground">The best universities, programs, and scholarships worldwide, considering cost, prestige, and specialization.</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-xl mb-2">Vocational Training</h3>
                  <p className="text-muted-foreground">Effective bootcamps, certifications, and trade schools for acquiring practical, job-ready skills.</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-xl mb-2">Career Placements</h3>
                  <p className="text-muted-foreground">Real-time job market data, company insights, and salary expectations across global markets.</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Map className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-xl mb-2">Global Opportunities</h3>
                  <p className="text-muted-foreground">International conferences, fellowships, volunteer programs, and relocation pathways to high-demand markets.</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-card rounded-3xl p-8 shadow-dramatic border border-border/50">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-premium rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Career Trajectory Analysis</div>
                        <div className="text-sm text-muted-foreground">AI-powered path optimization</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-secondary">95%</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Goal Achievement</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-secondary/20 rounded-full">
                          <motion.div 
                            className="h-full bg-secondary rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "85%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                          />
                        </div>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Skill Mastery</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-primary/20 rounded-full">
                          <motion.div 
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "92%" }}
                            transition={{ duration: 1.5, delay: 0.7 }}
                          />
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Career Acceleration</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-accent/20 rounded-full">
                          <motion.div 
                            className="h-full bg-accent rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "78%" }}
                            transition={{ duration: 1.5, delay: 0.9 }}
                          />
                        </div>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-32 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-6 py-2 mb-6">
              <Play className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">See It In Action</span>
            </div>
            <h2 className="font-poppins font-bold text-4xl md:text-6xl mb-6 text-foreground">
              Experience the Future of Learning
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Try our AI-powered career guidance system and see how it transforms vague aspirations into actionable learning paths.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <EnhancedDemo />
          </motion.div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section id="features" className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-6 py-2 mb-6">
              <Zap className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">The Pathfinder Way</span>
            </div>
            <h2 className="font-poppins font-bold text-4xl md:text-6xl mb-6 text-foreground">
              More Than a Plan. A Partnership.
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Pathfinder's magic isn't one feature—it's the powerful synthesis of three integrated systems working as your personal career co-pilot.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Pillar 1 */}
            <motion.div
              className="group relative bg-gradient-card rounded-3xl p-8 shadow-smooth border border-border/50 hover:shadow-colored transition-all duration-500"
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <motion.div
                className="relative w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Brain className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="relative font-poppins font-semibold text-2xl mb-4 text-card-foreground">
                Dynamic Curriculum Generation
              </h3>
              <p className="relative text-muted-foreground leading-relaxed mb-6">
                Our AI analyzes thousands of successful career trajectories to build a comprehensive, personalized "Skill Graph" just for you. No more guessing what to learn next.
              </p>
              <div className="relative space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                  <span>Goal parsing accuracy: {">"}95%</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                  <span>Skill gap identification: {">"}90%</span>
                </div>
              </div>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div
              className="group relative bg-gradient-card rounded-3xl p-8 shadow-smooth border border-border/50 hover:shadow-colored transition-all duration-500"
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <motion.div
                className="relative w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Search className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="relative font-poppins font-semibold text-2xl mb-4 text-card-foreground">
                Universal Resource Curation
              </h3>
              <p className="relative text-muted-foreground leading-relaxed mb-6">
                We scour the entire internet—YouTube lectures from top universities, industry blog posts, open-source projects, and research papers—to find the best free resources.
              </p>
              <div className="relative space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                  <span>Resource quality score: {">"}4.2/5</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                  <span>Content freshness: {"<"}6 months</span>
                </div>
              </div>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div
              className="group relative bg-gradient-card rounded-3xl p-8 shadow-smooth border border-border/50 hover:shadow-colored transition-all duration-500"
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <motion.div
                className="relative w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <MessageCircle className="h-8 w-8 text-accent-foreground" />
              </motion.div>
              <h3 className="relative font-poppins font-semibold text-2xl mb-4 text-card-foreground">
                Interactive AI Mentorship
              </h3>
              <p className="relative text-muted-foreground leading-relaxed mb-6">
                Your curriculum lives inside a conversational interface with an AI mentor providing continuous support, answering questions, and adapting your path in real-time.
              </p>
              <div className="relative space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                  <span>Response relevance: {">"}4.3/5</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                  <span>Problem resolution: {">"}85%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Strategic Horizons */}
      <section className="py-32 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-accent/10 text-accent rounded-full px-6 py-2 mb-6">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Strategic Roadmap</span>
            </div>
            <h2 className="font-poppins font-bold text-4xl md:text-6xl mb-6 text-foreground">
              Three Horizons to Global Impact
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <motion.div
              className="bg-card rounded-3xl p-8 shadow-smooth border border-border relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl" />
              <div className="relative">
                <div className="text-5xl font-bold text-primary mb-4">01</div>
                <h3 className="font-poppins font-semibold text-xl mb-4">Master Online Learning</h3>
                <p className="text-muted-foreground mb-6">Perfect automated curriculum generation from free, public resources. Become the best at personalized learning paths.</p>
                <div className="text-sm text-primary font-medium">Next 12-18 Months</div>
              </div>
            </motion.div>

            <motion.div
              className="bg-card rounded-3xl p-8 shadow-smooth border border-border relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/5 rounded-full blur-xl" />
              <div className="relative">
                <div className="text-5xl font-bold text-secondary mb-4">02</div>
                <h3 className="font-poppins font-semibold text-xl mb-4">Structured Education & Careers</h3>
                <p className="text-muted-foreground mb-6">Expand to formal opportunities with university pathways, job matching, and certification integration.</p>
                <div className="text-sm text-secondary font-medium">Years 2-3</div>
              </div>
            </motion.div>

            <motion.div
              className="bg-card rounded-3xl p-8 shadow-smooth border border-border relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full blur-xl" />
              <div className="relative">
                <div className="text-5xl font-bold text-accent mb-4">03</div>
                <h3 className="font-poppins font-semibold text-xl mb-4">Global Life Architect</h3>
                <p className="text-muted-foreground mb-6">Complete global opportunity engine with international experiences, relocation guidance, and holistic life planning.</p>
                <div className="text-sm text-accent font-medium">Years 4-5+</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-secondary/10 text-secondary rounded-full px-6 py-2 mb-6">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Success Stories</span>
            </div>
            <h2 className="font-poppins font-bold text-4xl md:text-6xl mb-6 text-foreground">
              Trusted by Ambitious Learners
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands who have transformed their careers with Pathfinder's AI-powered guidance.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Testimonial 1 */}
            <motion.div
              className="bg-card rounded-3xl p-8 shadow-smooth border border-border relative overflow-hidden group"
              variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-hero opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity" />
              <div className="relative">
                <div className="flex items-start mb-6">
                  <img
                    src={elenaImage}
                    alt="Elena's headshot"
                    className="w-16 h-16 rounded-full object-cover mr-4 ring-2 ring-secondary/20"
                  />
                  <div>
                    <h4 className="font-poppins font-semibold text-lg text-card-foreground">Elena Rodriguez</h4>
                    <p className="text-muted-foreground">Marketing → Product Manager</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-accent fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-card-foreground leading-relaxed text-lg">
                  "Pathfinder gave me a clear path from marketing into a product management role in just 6 months. 
                  It's like having a world-class career coach available 24/7. The AI mentor understood exactly what I needed to learn."
                </blockquote>
                <div className="mt-6 text-sm text-muted-foreground">
                  ✓ Career transition in 6 months • ✓ 40% salary increase
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              className="bg-card rounded-3xl p-8 shadow-smooth border border-border relative overflow-hidden group"
              variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-hero opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity" />
              <div className="relative">
                <div className="flex items-start mb-6">
                  <img
                    src={davidImage}
                    alt="David's headshot"
                    className="w-16 h-16 rounded-full object-cover mr-4 ring-2 ring-primary/20"
                  />
                  <div>
                    <h4 className="font-poppins font-semibold text-lg text-card-foreground">David Chen</h4>
                    <p className="text-muted-foreground">Retail → Software Developer</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-accent fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-card-foreground leading-relaxed text-lg">
                  "I tried to learn coding for years with random courses. Pathfinder built a curriculum that actually made sense 
                  and kept me motivated. Now I'm a junior developer at a tech startup!"
                </blockquote>
                <div className="mt-6 text-sm text-muted-foreground">
                  ✓ Complete career change • ✓ Landed dream job in tech
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-gradient-mesh relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-60 h-60 bg-white/5 rounded-full blur-2xl"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 25, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            className="max-w-3xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20">
              <Rocket className="h-4 w-4 mr-2 text-accent" />
              <span className="text-sm font-medium">Join the Future of Learning</span>
            </div>

            <h2 className="font-poppins font-bold text-4xl md:text-6xl mb-8">
              Ready to Build Your Future?
            </h2>

            <p className="text-xl mb-12 opacity-90 leading-relaxed">
              Join 10,000+ ambitious learners who are already transforming their careers with AI-powered guidance.
            </p>

            <form onSubmit={handleEmailSubmit} className="max-w-lg mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email for early access"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70 flex-1 h-14 text-lg backdrop-blur-sm"
                  required
                />
                <Button 
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="bg-accent hover:bg-accent-hover text-accent-foreground shadow-dramatic"
                  asChild
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.button>
                </Button>
              </div>
            </form>

            <div className="flex items-center justify-center mt-8 text-white/80">
              <CheckCircle className="h-5 w-5 mr-3" />
              <span>Free forever • No credit card required • Join 10,000+ learners</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Index