"use client"

import { motion } from "framer-motion"
import { SiteHeader } from "../components/site-header"
import { Footer } from "../components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Apple, Facebook, Github, Mail, Twitter } from "lucide-react"
import { MetamaskFox } from "../components/icons/metamask-fox"

export default function Register() {
  const oauthProviders = [
    {
      name: "Google",
      icon: Mail,
      color: "hover:bg-red-500/10 hover:text-red-500 border-red-500/20",
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "hover:bg-blue-500/10 hover:text-blue-500 border-blue-500/20",
    },
    {
      name: "Apple",
      icon: Apple,
      color: "hover:bg-gray-500/10 hover:text-gray-300 border-gray-500/20",
    },
    {
      name: "Github",
      icon: Github,
      color: "hover:bg-purple-500/10 hover:text-purple-500 border-purple-500/20",
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "hover:bg-blue-600/10 hover:text-blue-600 border-blue-600/20",
    },
    {
      name: "MetaMask",
      icon: MetamaskFox,
      color: "hover:bg-[#F6851B]/10 hover:text-[#F6851B] border-[#F6851B]/20",
    },
  ]

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md space-y-8"
          >
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Create Account</h1>
              <p className="text-muted-foreground">Choose your preferred registration method</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {oauthProviders.map((provider) => (
                <Button
                  key={provider.name}
                  variant="outline"
                  className={`h-14 relative overflow-hidden group ${provider.color}`}
                >
                  <div className="relative z-10 flex items-center justify-center gap-3 text-sm font-medium">
                    <provider.icon className="w-5 h-5" />
                    {provider.name}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity" />
                </Button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/signin" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                By registering, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

