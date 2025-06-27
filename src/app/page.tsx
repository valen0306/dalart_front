'use client';

import { useEffect, useState } from 'react';
import Footer from './components/BottomNavigationBar';
import Header from './components/Header';
import styles from './route.module.css';
import UserIcon from './components/user-icon';
import OutfitImage from './components/FashionDisplay';
import SplashScreen from './components/Splash';
import Loading from './components/Loading';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);

  // スプラッシュが終わったら次にLoadingへ
  useEffect(() => {
    if (!showSplash) {
      const timer = setTimeout(() => setLoading(false), 2000); // API読み込みのふり
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (loading) {
    return <Loading />;
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

