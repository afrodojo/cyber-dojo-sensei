import React from 'react';
import { motion } from 'framer-motion';

export default function TrustedBy() {
  const trustedLogos = [
    { name: 'U.S. Marine Corps' },
    { name: 'Maximus / DISA' },
    { name: 'Booz Allen Hamilton' },
    { name: 'ICS-Nett / DCSA' },
    { name: 'SAIC' },
    { name: 'Dell' },
  ];

  const ownedBusinesses = [
    { 
      name: 'EDS Defense', 
      subtitle: 'Firearms, CPR, Exec Protection & Drone Ops',
      url: 'https://defense.eds-360.com',
      emoji: '🛡️'
    },
    { 
      name: 'EDS Cyber', 
      subtitle: 'Cybersecurity & IT Division',
      url: 'https://cyber.eds-360.com',
      emoji: '🔐'
    },
    { 
      name: 'EDS Notary & Process', 
      subtitle: 'Mobile Notary & Process Server',
      url: 'https://nps.eds-360.com',
      emoji: '📋'
    },
    { 
      name: 'Mow Dojo', 
      subtitle: 'Landscaping & Lawn Care',
      url: 'https://mowdojo.eds-360.com',
      emoji: '🌿'
    },
  ];

  return (
    <div className="bg-slate-900 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Owned Businesses Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-center text-lg font-semibold leading-8 text-slate-300 mb-10">
            Founded & Leading Enterprises
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {ownedBusinesses.map((business, index) => (
              <motion.a
                key={business.name}
                href={business.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300 group"
              >
                <div className="text-4xl mb-3">{business.emoji}</div>
                <div className="text-white font-semibold text-sm mb-1 group-hover:text-cyan-300 transition-colors">{business.name}</div>
                <div className="text-slate-400 text-xs leading-tight">{business.subtitle}</div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Trusted By Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-center text-lg font-semibold leading-8 text-slate-300">
            Trusted by and partnered with leading government and commercial organizations
          </h2>
          <div className="mt-10 grid grid-cols-2 max-w-lg mx-auto items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-6">
            {trustedLogos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="col-span-1 flex justify-center"
              >
                <div className="text-xl font-bold text-slate-400 text-center filter grayscale hover:grayscale-0 hover:text-white transition-all duration-300">
                  {logo.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}