'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import DemoSection from '@/components/landing/DemoSection';
import Footer from '@/components/landing/Footer';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Home Page - VoteSaathi
 * Refactored into modular components for better maintainability and code quality.
 */
export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background text-text">
      <Navbar t={t} />
      <Hero t={t} />
      <Features t={t} />
      <DemoSection t={t} />
      <Footer t={t} />
    </main>
  );
}
