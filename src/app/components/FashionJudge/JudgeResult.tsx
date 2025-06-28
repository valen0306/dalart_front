'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { createClient } from '@supabase/supabase-js';

type JudgeResultProps = {
  result: {
    label: string;
    reason: string;
    advice: string;
    image_url: string;
  };
  photo: string;
  onRetake: () => void;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function JudgeResult({ result, photo, onRetake }: JudgeResultProps) {
  const isDarui = result.label === 'ダル着';

  const handlePost = async () => {
    console.log("handlePost");
    
    try {
      // 1. ユーザー情報取得
      const user = (await supabase.auth.getUser()).data.user;
      console.log(user);//debug
      if (!user) throw new Error('ユーザー情報が取得できません');

      // 2. 画像をStorageにアップロード（dataURL→Blob変換）
      const fileName = `${user.id}_${Date.now()}.png`;
      console.log("fileName",fileName);//debug
      const imageBlob = await (await fetch(photo)).blob();
      console.log("imageBlob",imageBlob);//debug
      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, imageBlob, { contentType: 'image/png' });
      console.log(uploadError);
      if (uploadError) throw uploadError;

      // 3. 投稿データをDBに保存
      const { error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            image_path: fileName,
            created_at: new Date().toISOString(),
          },
        ]);
      if (insertError) throw insertError;

      alert('投稿が完了しました！');
      onRetake();
    } catch {
      alert('投稿に失敗しました');
    }
  };

  return (
    <Box sx={{ p: 2, minHeight: '100vh', bgcolor: '#FFFCF7', textAlign: 'center' }}>
      {/* <Typography sx={{ fontFamily: 'Chewy, sans-serif', color: '#544739', fontSize: 28, mt: 2, mb: 3 }}>
        DaLert
      </Typography> */}
      
      <Box
        sx={{
          mx: 'auto',
          mt: 4,
          mb: 2,
          width: 260,
          border: '3px solid #888',
          borderRadius: 2,
          bgcolor: '#EDEDEB',
          p: 2,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ fontSize: 14, color: '#544739', mb: 1 }}>判定結果・・・</Typography>
        <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#544739', mb: 1 }}>
          {isDarui ? 'ダル着' : '合格！！'}
        </Typography>
      </Box>

      {/* 理由とアドバイスを表示 */}
      <Box
        sx={{
          mx: 'auto',
          mb: 3,
          width: 320,
          border: '2px solid #8CA19B',
          borderRadius: 2,
          bgcolor: '#F8F9FA',
          p: 3,
          textAlign: 'left',
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#544739', mb: 2 }}>
          {isDarui ? '判定理由' : '合格ポイント'}
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#544739', mb: 3, lineHeight: 1.6 }}>
          {result.reason}
        </Typography>
        
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#544739', mb: 2 }}>
          アドバイス
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#544739', lineHeight: 1.6 }}>
          {result.advice}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
        <Button
          onClick={onRetake}
          variant="outlined"
          sx={{
            borderColor: '#8CA19B',
            color: '#8CA19B',
            fontWeight: 600,
            borderWidth: 2,
            borderRadius: 3,
            px: 4,
            py: 1,
            fontSize: 18,
            '&:hover': { borderColor: '#6B857A', color: '#6B857A' },
          }}
        >
          再撮影
        </Button>
        <Button
          onClick={handlePost}
          variant="contained"
          sx={{
            bgcolor: '#8CA19B',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 3,
            px: 4,
            py: 1,
            fontSize: 18,
            '&:hover': { bgcolor: '#6B857A' },
          }}
        >
          投稿
        </Button>
      </Box>
    </Box>
  );
}