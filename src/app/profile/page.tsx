'use client';

import React, { useRef, useState } from 'react';
import { Box, Button, Avatar, Typography } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import Footer from '../components/BottomNavigationBar';
import Header from '../components/Header';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 画像選択→アップロード
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('選択されたファイル:', file);
    if (!file) return;

    setUploading(true);

    // ユーザーID取得
    const { data: { user } } = await supabase.auth.getUser();
    console.log('取得したユーザー:', user);
    if (!user) {
      alert('ログインしてください');
      setUploading(false);
      return;
    }

    // ファイル名を一意に
    const fileName = `${user.id}_${Date.now()}.${file.name.split('.').pop()}`;
    console.log('アップロードするファイル名:', fileName);
    const { data, error } = await supabase.storage
      .from('user')
      .upload(fileName, file, { upsert: true });
    console.log('アップロード結果:', { data, error });

    if (error) {
      alert('アップロード失敗: ' + error.message);
      setUploading(false);
      return;
    }

    // 公開URL取得
    const { data: publicUrlData } = supabase
      .storage
      .from('user')
      .getPublicUrl(fileName);
    console.log('取得した公開URL:', publicUrlData);

    setAvatarUrl(publicUrlData.publicUrl);

    // profilesテーブルのavatar_urlを更新
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrlData.publicUrl })
      .eq('id', user.id);
    console.log('profilesテーブル更新結果:', { updateData, updateError });

    setUploading(false);
  };

  return (
    <div> 
        <Header />
        <Box sx={{ p: 4, textAlign: 'center',bgcolor: '#FFFCF7',minHeight: '100vh',   // 高さを画面いっぱいに
    width: '100vw',       // 幅を画面いっぱいに
    boxSizing: 'border-box', // パディング込みで幅を計算  
    }}>
      <Typography variant="h5" sx={{ mb: 2 }}>プロフィール画像を変更</Typography>
      <Avatar
        src={avatarUrl || '/ホームアイコン.svg'}
        sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'アップロード中...' : '画像を選択'}
      </Button>
      <Footer />
    </Box>
    </div>
    
    
  );
}
