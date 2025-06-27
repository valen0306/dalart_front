'use client';

import React, { useState } from 'react';
import Footer from './components/BottomNavigationBar';
import Header from './components/Header';
import styles from './route.module.css';
import SplashScreen from './components/Splash';
import Timeline from './components/Timeline/Timeline';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <Timeline />
      <Footer />
    </div>
  );
}

