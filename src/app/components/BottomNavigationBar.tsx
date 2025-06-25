'use client';

import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/', icon: <HomeIcon /> },
  { href: '/post', icon: <AddBoxIcon /> },
  { href: '/profile', icon: <AccountCircleIcon /> },
];

export default function BottomNavigationBar() {
  const router = useRouter(); // ナビゲーションのためにrouterを使用
  const pathname = usePathname();


  const currentIndex = navItems.findIndex(item => item.href === pathname);
  const [value, setValue] = React.useState(currentIndex); // BottomNavigationのstate

  // valueが変更されたときにページ遷移を行う
  React.useEffect(() => {
    if (value !== -1 && navItems[value] && navItems[value].href !== pathname) {
      router.push(navItems[value].href);
    }
  }, [value, router, pathname]);

  // pathnameが変更されたときにvalueを更新
  React.useEffect(() => {
    const newIndex = navItems.findIndex(item => item.href === pathname);
    if (newIndex !== -1 && newIndex !== value) {
      setValue(newIndex);
    }
  }, [pathname, value]);


  return (
    <BottomNavigation
      showLabels // ラベル（テキスト）を表示
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      // MUIのスタイルを直接適用
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: { xs: 'flex', md: 'none' },
        backgroundColor: '#8CA19B',
      }}
    >
      {navItems.map((item, index) => (
        <BottomNavigationAction
          key={index}
          icon={item.icon}
          value={index}
          sx={{
            color: '#fff',
            '&.Mui-selected': {
              color: '#544739', // 選択時の色をここで指定！
            },
            '& .MuiSvgIcon-root': {
              fontSize: 40,
            }
          }}
        />
      ))}
    </BottomNavigation>
  );
}
