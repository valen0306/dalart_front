import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

export default function TimelinePost({ post }: { post: any }) {
  // 画像URLの生成
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/${post.image_path}`;
  const username = post.profiles?.user_name || 'unknown';
  
  // アバター画像URLの生成
  const avatarUrl = post.profiles?.avatar_url 
    ? post.profiles.avatar_url.startsWith('http') 
      ? post.profiles.avatar_url 
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user/${post.profiles.avatar_url}`
    : '/ホームアイコン.svg';

  return (
    <Box sx={{
      bgcolor: 'transparent',
      borderRadius: 5,
      p: 2,
      mb: 4,
      boxShadow: 'none',
      textAlign: 'center',
      maxWidth: 350,
      mx: 'auto'
    }}>
      {/* <Box sx={{ mb: 1 }}>
        <Avatar src={avatarUrl} sx={{ width: 48, height: 48, mx: 'auto' }} />
        <Typography sx={{ fontWeight: 600, mt: 1 }}>{username}</Typography>
      </Box> */}
      <Box
        sx={{
          width: 320,         // 幅
          height: 440,        // 高さ
          borderRadius: 5,
          overflow: 'hidden',
          mb: 1,
          mx: 'auto',         // 中央寄せ
          border: '7px solid #8CA19B', // 撮影時と同じ枠
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={imageUrl}
          alt="投稿画像"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </Box>
      <Typography sx={{ color: '#888', fontSize: 12 }}>
        {new Date(post.created_at).toLocaleString('ja-JP', { hour12: false })}
      </Typography>
    </Box>
  );
}

// ストーリーアイコン用
TimelinePost.StoryIcon = function StoryIcon({ label, img }: { label: string, img: string }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Avatar src={img} sx={{ width: 64, height: 64, border: '3px solid #E0D9C7', mx: 'auto' }} />
      <Typography sx={{ fontSize: 14, mt: 1 }}>{label}</Typography>
    </Box>
  );
};
