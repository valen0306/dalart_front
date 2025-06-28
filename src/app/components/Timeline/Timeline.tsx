'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import TimelinePost from './Timelinepost';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useRouter } from 'next/navigation';

// ストーリーアイコン用
import Avatar from '@mui/material/Avatar';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Timeline() {
  const [posts, setPosts] = useState<Array<{
    id: string;
    user_id: string;
    image_path: string;
    created_at: string;
    profiles?: {
      user_name: string;
      avatar_url: string;
    };
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  // 認証状態の確認
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setAuthLoading(false);
    };

    checkUser();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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

  // 手動更新用の関数（外部から呼び出し可能）
  const refreshTimeline = () => {
    fetchPosts();
  };

  // グローバルに公開（他のコンポーネントから呼び出し可能）
  if (typeof window !== 'undefined') {
    (window as any).refreshTimeline = refreshTimeline;
  }

  useEffect(() => {
    fetchPosts();
    
    // リアルタイム更新のためのsubscription
    const channel = supabase
      .channel('timeline-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' }, 
        () => {
          fetchPosts();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    // クリーンアップ
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 各ユーザーの最新投稿だけを抽出
  const latestPostsByUser: Array<{
    id: string;
    user_id: string;
    image_path: string;
    created_at: string;
    profiles?: {
      user_name: string;
      avatar_url: string;
    };
  }> = [];
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

  // 認証状態の読み込み中
  if (authLoading) {
    return <Box sx={{ textAlign: 'center', mt: 4 }}>読み込み中...</Box>;
  }

  // 未認証ユーザー向けの表示
  if (!user) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', my: '3rem', textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 3, color: '#8CA19B', fontWeight: 'bold' }}>
          Dalertへようこそ
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
          今日の服装を判定してもらおう！
        </Typography>
        
        {/* サンプル投稿の表示
        {posts.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#8CA19B' }}>
              みんなの投稿
            </Typography>
            <Box sx={{ 
              maxHeight: 300, 
              overflow: 'hidden', 
              borderRadius: 2,
              border: '2px solid #E0D9C7'
            }}>
              <img 
                src={posts[0].image_path} 
                alt="サンプル投稿" 
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  objectFit: 'cover'
                }} 
              />
            </Box>
          </Box>
        )} */}
        
        {/* 認証ボタン */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={() => router.push('/auth/signin')}
            sx={{
              bgcolor: '#8CA19B',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: 16,
              '&:hover': { bgcolor: '#6B857A' },
            }}
          >
            サインイン
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/auth/signup')}
            sx={{
              borderColor: '#8CA19B',
              color: '#8CA19B',
              fontWeight: 600,
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: 16,
              borderWidth: 2,
              '&:hover': { 
                borderColor: '#6B857A', 
                color: '#6B857A',
                bgcolor: 'rgba(139, 161, 155, 0.1)'
              },
            }}
          >
            サインアップ
          </Button>
        </Box>
      </Box>
    );
  }

  // 投稿がない場合
  if (!posts || posts.length === 0) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', my: '3rem', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#8CA19B' }}>
          まだ投稿がありません
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
          最初の投稿をしてみましょう！
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/post')}
          sx={{
            bgcolor: '#8CA19B',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: 16,
            '&:hover': { bgcolor: '#6B857A' },
          }}
        >
          投稿する
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', my: '3rem' }}>
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
        {latestPostsByUser.map((post, idx) => {
          // アバター画像URLの生成
          const avatarUrl = post.profiles?.avatar_url 
            ? post.profiles.avatar_url.startsWith('http') 
              ? post.profiles.avatar_url 
              : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user/${post.profiles.avatar_url}`
            : '/ホームアイコン.svg';

          return (
            <SwiperSlide key={post.user_id}>
              <Box sx={{ textAlign: 'center', opacity: idx === activeIndex ? 1 : 0.5 }}>
                <Avatar 
                  src={avatarUrl} 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    border: '3px solid #E0D9C7',
                    cursor: 'pointer'
                  }} 
                />
                <Typography sx={{ fontSize: 13, mt: 1 }}>{post.profiles?.user_name || 'unknown'}</Typography>
              </Box>
            </SwiperSlide>
          );
        })}
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