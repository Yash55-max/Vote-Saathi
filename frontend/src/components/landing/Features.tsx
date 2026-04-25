'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Accessibility, Contrast } from 'lucide-react';

interface FeaturesProps {
  t: (key: string) => string;
}

const Features: React.FC<FeaturesProps> = ({ t }) => {
  const accessibilityFeatures = [
    { 
      icon: Globe, 
      label: t('multilingual'), 
      desc: t('multilingualDesc')
    },
    { 
      icon: Accessibility, 
      label: t('screenReader'), 
      desc: t('screenReaderDesc') 
    },
    { 
      icon: Contrast, 
      label: t('highContrast'), 
      desc: t('highContrastDesc') 
    },
  ];

  return (
    <section className="bg-surface-2 py-24 px-6 border-y border-surface-2">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-primary mb-4">{t('accessibilityHeading')}</h2>
          <p className="text-muted max-w-2xl mx-auto">
            {t('accessibilitySub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {accessibilityFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface p-8 rounded-xl border border-surface-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{feature.label}</h3>
              <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
