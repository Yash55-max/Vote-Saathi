'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  t: (key: string) => string;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="py-12 px-6 border-t border-surface-2 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xs text-muted font-medium tracking-tight">
          {t('footerText')}
        </div>
        <div className="flex gap-6 text-xs text-muted font-bold uppercase tracking-widest">
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Use</Link>
          <Link href="#" className="hover:text-primary transition-colors">Accessibility Statement</Link>
          <Link href="#" className="hover:text-primary transition-colors">Contact Helpdesk</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
