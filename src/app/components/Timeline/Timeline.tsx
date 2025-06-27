'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import TimelinePost from './Timelinepost';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// ストーリーアイコン用
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PAGE_SIZE = 7;

export default function Timeline() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (append = false) => {
    setLoading(true);
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(user_name, avatar_url)')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      alert('投稿の取得に失敗しました');
      console.error(error);
      setLoading(false);
      return;
    }
    if (append) {
      setPosts((prev) => [...prev, ...(data || [])]);
    } else {
      setPosts(data || []);
    }
    setHasMore((data?.length || 0) === PAGE_SIZE);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [offset]);

  const handleLoadMore = () => {
    setOffset((prev) => prev + PAGE_SIZE);
    fetchPosts(true);
  };

  // ユニークなユーザーごとにストーリーアイコンを生成
  const storyUsers = Array.from(
    new Map(posts.map(post => [post.user_id, post.profiles?.user_name || 'unknown'])).entries()
  );

  if (!posts || posts.length === 0) {
    return <Box sx={{ textAlign: 'center', mt: 4 }}>投稿がありません</Box>;
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      {/* ストーリー風アイコン横並び */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2, overflowX: 'auto' }}>
        {storyUsers.map(([user_id, user_name]) => (
          <Box key={user_id} sx={{ textAlign: 'center' }}>
            <Avatar src="/ホームアイコン.svg" sx={{ width: 56, height: 56, mx: 'auto', border: '3px solid #E0D9C7' }} />
            <Typography sx={{ fontSize: 13, mt: 1 }}>{user_name as string}</Typography>
          </Box>
        ))}
      </Box>
      {/* Swiperで1投稿ずつ表示 */}
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        centeredSlides={true}
        loop={false}
        style={{
          borderRadius: 20,
          background: '#FFFCF7',
          boxShadow: '0 2px 8px #ccc',
          padding: '24px 0'
        }}
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id}>
            <TimelinePost post={post} />
          </SwiperSlide>
        ))}
      </Swiper>
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {hasMore && !loading && (
        <Button onClick={handleLoadMore} sx={{ display: 'block', mx: 'auto', my: 2 }}>
          さらに読み込む
        </Button>
      )}
    </Box>
  );
}