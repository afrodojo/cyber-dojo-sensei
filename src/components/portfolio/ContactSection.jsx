import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Shield, ExternalLink, Linkedin, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "cyberdojosensai@gmail.com",
      href: "mailto:cyberdojosensai@gmail.com",
      color: "text-cyan-400"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "657-658-5859",
      href: "tel:+16576585859",
      color: "text-blue-400"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Fredericksburg, VA",
      href: null,
      color: "text-green-400"
    }
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/asaad-morman-4403423b/",
      color: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/asaad.morman.2025",
      color: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/cyberdojosolutions/?hl=en",
      color: "from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent pb-2">
          Let's Connect
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Ready to bring elite cybersecurity expertise to your organization. Let's discuss how my skills can strengthen your security posture.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white pb-2">Contact Information</h3>
              </div>

              <div className="space-y-6 mb-8">
                {contactInfo.map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className={`w-12 h-12 bg-slate-600/50 rounded-lg flex items-center justify-center`}>
                      <contact.icon className={`w-6 h-6 ${contact.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-sm">{contact.label}</p>
                      {contact.href ? (
                        <a
                          href={contact.href}
                          className={`font-semibold ${contact.color} hover:underline text-lg`}
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className={`font-semibold ${contact.color} text-lg`}>
                          {contact.value}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Media Links */}
              <div className="mb-8">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2 pb-2">
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  Follow Me
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.1 }}
                      className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      <social.icon className="w-6 h-6 text-white" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Security Clearance Highlight */}
              <div className="p-4 bg-gradient-to-r from-red-950/30 to-blue-950/30 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 font-semibold">Security Clearance</span>
                </div>
                <p className="text-white font-bold text-lg">TS/SCI w/CI Polygraph</p>
                <p className="text-slate-400 text-sm">Active and current</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-3xl font-bold text-white mb-4 pb-2">
              Ready to Secure Your Future?
            </h3>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              With 15+ years of cybersecurity expertise, 7 years of Marine Corps leadership, and active TS/SCI clearance, I'm ready to tackle your most challenging security objectives.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold"
            >
              <Link to={createPageUrl('Contact')}>
                <Mail className="w-5 h-5 mr-2" />
                Send Message
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="text-center p-4 bg-slate-800/30 rounded-lg">
              <div className="text-2xl font-bold text-cyan-400 mb-1">15+</div>
              <div className="text-sm text-slate-400">Years Experience</div>
            </div>
            <div className="text-center p-4 bg-slate-800/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">TS/SCI</div>
              <div className="text-sm text-slate-400">Security Clearance</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}