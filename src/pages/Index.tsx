"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Search, MessageCircle, ArrowRight, ChevronRight, Mail, CheckCircle } from "lucide-react"
import heroImage from "@/assets/hero-bg.jpg"
import elenaImage from "@/assets/testimonial-elena.jpg"
import davidImage from "@/assets/testimonial-david.jpg"

const Index = () => {
  const [email, setEmail] = useState("")

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="font-poppins font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight"
              variants={fadeInUp}
            >
              Stop Guessing What's Next.<br />
              <span className="text-accent">Start Building Your Future.</span>
            </motion.h1>
            
            <motion.p 
              className="font-inter text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Pathfinder is your personal AI mentor that builds a dynamic, step-by-step learning path to any professional goal, using the best resources from the entire internet.
            </motion.p>
            
            <motion.div variants={fadeInUp}>
              <Button 
                variant="hero" 
                size="xl"
                className="group"
                asChild
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Generate Your Free Path
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins font-bold text-3xl md:text-5xl mb-4 text-foreground">
              More Than a Plan. A Partnership.
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Pillar 1 */}
            <motion.div
              className="bg-card p-8 rounded-2xl shadow-smooth border border-border hover:shadow-glow transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Brain className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="font-poppins font-semibold text-xl mb-4 text-card-foreground">
                Dynamic Curriculum Generation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI analyzes thousands of successful career trajectories to build a comprehensive, personalized "Skill Graph" just for you. No more guessing what to learn next.
              </p>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div
              className="bg-card p-8 rounded-2xl shadow-smooth border border-border hover:shadow-glow transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Search className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="font-poppins font-semibold text-xl mb-4 text-card-foreground">
                Universal Resource Curation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We scour the entire internet—YouTube lectures from top universities, industry blog posts, open-source projects, and research papers—to find the best free resources.
              </p>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div
              className="bg-card p-8 rounded-2xl shadow-smooth border border-border hover:shadow-glow transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-8 w-8 text-accent-foreground" />
              </motion.div>
              <h3 className="font-poppins font-semibold text-xl mb-4 text-card-foreground">
                Interactive AI Mentorship
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your curriculum lives inside a conversational interface with an AI mentor providing continuous support, answering questions, and adapting your path in real-time.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins font-bold text-3xl md:text-5xl mb-4 text-foreground">
              Trusted by Ambitious Learners
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Testimonial 1 */}
            <motion.div
              className="bg-card p-8 rounded-2xl shadow-smooth border border-border"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start mb-6">
                <img
                  src={elenaImage}
                  alt="Elena's headshot"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-poppins font-semibold text-lg text-card-foreground">Elena</h4>
                  <p className="text-muted-foreground">Product Manager</p>
                </div>
              </div>
              <p className="text-card-foreground leading-relaxed">
                "Pathfinder gave me a clear path from marketing into a product management role in just 6 months. It's like having a world-class career coach 24/7."
              </p>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              className="bg-card p-8 rounded-2xl shadow-smooth border border-border"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start mb-6">
                <img
                  src={davidImage}
                  alt="David's headshot"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-poppins font-semibold text-lg text-card-foreground">David</h4>
                  <p className="text-muted-foreground">Junior Developer</p>
                </div>
              </div>
              <p className="text-card-foreground leading-relaxed">
                "I tried to learn coding for years with random courses. Pathfinder built a curriculum that actually made sense and kept me motivated."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <motion.div
            className="max-w-2xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins font-bold text-3xl md:text-5xl mb-6">
              Ready to Build Your Future?
            </h2>
            
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70 flex-1"
                  required
                />
                <Button 
                  type="submit"
                  variant="hero"
                  className="bg-accent hover:bg-accent-hover text-accent-foreground"
                  asChild
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Request Early Access
                  </motion.button>
                </Button>
              </div>
            </form>
            
            <div className="flex items-center justify-center mt-6 text-white/80">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">Join 10,000+ future learners</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Index
