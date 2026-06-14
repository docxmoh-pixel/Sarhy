"use client"

import Link from "next/link"
import { 
  Sparkles, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin,
  Github
} from "lucide-react"
import { useLanguage } from "@/lib/language"

const footerLinks = {
  sections: [
    { key: "resha", href: "/marketplace/resha" },
    { key: "atheer", href: "/marketplace/atheer" },
    { key: "midad", href: "/marketplace/midad" },
    { key: "holool", href: "/marketplace/holool" },
    { key: "mahara", href: "/marketplace/mahara" },
    { key: "erth", href: "/marketplace/erth" },
    { key: "aoun", href: "/marketplace/aoun" },
  ],
  resources: [
    { key: "help", href: "/help", ar: "مركز المساعدة", en: "Help Center" },
  ],
  legal: [
    { key: "privacy", href: "/help", ar: "الخصوصية", en: "Privacy" },
    { key: "terms", href: "/help", ar: "الشروط", en: "Terms" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "/help", label: "Twitter" },
  { icon: Instagram, href: "/help", label: "Instagram" },
  { icon: Youtube, href: "/help", label: "YouTube" },
  { icon: Linkedin, href: "/help", label: "LinkedIn" },
  { icon: Github, href: "/help", label: "GitHub" },
]

export function Footer() {
  const { language, t } = useLanguage()
  
  return (
    <footer className="relative py-16 lg:py-24 border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                {language === "ar" ? "صرحي" : "Sarhy"}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {language === "ar" ? "مستقبل الإنتاج الرقمي" : "The Future of Digital Production"}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Sections Column */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{language === "ar" ? "السوق" : "Marketplace"}</h4>
            <ul className="space-y-3">
              {footerLinks.sections.slice(0, 4).map((link) => (
                <li key={link.key}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(`sections.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* More Sections */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground opacity-0">{language === "ar" ? "المزيد" : "More"}</h4>
            <ul className="space-y-3">
              {footerLinks.sections.slice(4).map((link) => (
                <li key={link.key}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(`sections.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources Column */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{language === "ar" ? "الموارد" : "Resources"}</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.key}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {language === "ar" ? link.ar : link.en}
                  </Link>
                </li>
              ))}
              {footerLinks.legal.map((link) => (
                <li key={link.key}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {language === "ar" ? link.ar : link.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} {language === "ar" ? "صرحي" : "Sarhy"}. {language === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {language === "ar" ? "الخصوصية" : "Privacy"}
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {language === "ar" ? "الشروط" : "Terms"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
