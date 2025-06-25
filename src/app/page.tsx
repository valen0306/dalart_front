'use client';

import React, { useState } from 'react';
import Footer from './components/BottomNavigationBar';
import Header from './components/Header';
import styles from './route.module.css';
import UserIcon from './components/user-icon';
import OutfitImage from './components/FashionDisplay';
import SplashScreen from './components/Splash';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <UserIcon size={80} />
      <OutfitImage ID="投稿画像" />
      <Footer />
    </div>
  );
}

