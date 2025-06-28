'use client';

import { useEffect, useState } from 'react';
import Footer from './components/BottomNavigationBar';
import Header from './components/Header';
import styles from './route.module.css';
import SplashScreen from './components/Splash';
import Timeline from './components/Timeline/Timeline';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  // スプラッシュが終わったら次にLoadingへ
  useEffect(() => {
    if (!showSplash) {
      const timer = setTimeout(() => {
        // ローディング完了処理
      }, 2000); // API読み込みのふり
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

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


