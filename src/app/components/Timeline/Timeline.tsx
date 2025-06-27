'use client';

import React, { useEffect, useState, useRef } from 'react';
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

  const fetchPosts = async () => {
    setLoading(true);
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    // ページネーションをやめて全件取得
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(user_name, avatar_url)')
      .gte('created_at', since)
      .order('created_at', { ascending: false });

    if (error) {
      alert('投稿の取得に失敗しました');
      console.error(error);
      setLoading(false);
      return;
    }
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  const handleLoadMore = () => {
    setOffset((prev) => prev + PAGE_SIZE);
    fetchPosts();
  };

  // 各ユーザーの最新投稿だけを抽出
  const latestPostsByUser: any[] = [];
  const seenUserIds = new Set();
  for (const post of posts) {
    if (!seenUserIds.has(post.user_id)) {
      latestPostsByUser.push(post);
      seenUserIds.add(post.user_id);
    }
  }

  // Swiperのインデックスを同期管理
  const [activeIndex, setActiveIndex] = useState(0);
  const storySwiperRef = useRef<any>(null);
  const postSwiperRef = useRef<any>(null);

  // SwiperのonSlideChangeでインデックスを同期
  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
    // もう一方のSwiperも同期
    if (storySwiperRef.current && storySwiperRef.current.swiper) {
      storySwiperRef.current.swiper.slideTo(index);
    }
    if (postSwiperRef.current && postSwiperRef.current.swiper) {
      postSwiperRef.current.swiper.slideTo(index);
    }
  };

  if (!posts || posts.length === 0) {
    return <Box sx={{ textAlign: 'center', mt: 4 }}>投稿がありません</Box>;
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      {/* ストーリー風アイコンSwiper */}
      <Swiper
        onSlideChange={(swiper) => handleSlideChange(swiper.activeIndex)}
        slidesPerView={3}
        spaceBetween={16}
        centeredSlides
        onClick={(swiper) => handleSlideChange(swiper.clickedIndex ?? 0)}
        onSwiper={(swiper) => { storySwiperRef.current = { swiper }; }}
        initialSlide={activeIndex}
        style={{ marginBottom: 16 }}
      >
        {latestPostsByUser.map((post, idx) => (
          <SwiperSlide key={post.user_id}>
            <Box sx={{ textAlign: 'center', opacity: idx === activeIndex ? 1 : 0.5 }}>
              <Avatar src="/ホームアイコン.svg" sx={{ width: 56, height: 56, mx: 'auto', border: '3px solid #E0D9C7' }} />
              <Typography sx={{ fontSize: 13, mt: 1 }}>{post.profiles?.user_name || 'unknown'}</Typography>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 投稿表示Swiper */}
      <Swiper
        onSlideChange={(swiper) => handleSlideChange(swiper.activeIndex)}
        slidesPerView={1}
        centeredSlides
        onSwiper={(swiper) => { postSwiperRef.current = { swiper }; }}
        initialSlide={activeIndex}
        style={{
          borderRadius: 20,
          background: 'transparent',
          boxShadow: 'none',
          padding: '24px 0'
        }}
      >
        {latestPostsByUser.map((post) => (
          <SwiperSlide key={post.id}>
            <TimelinePost post={post} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}