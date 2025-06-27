'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import TimelinePost from './Timelinepost';

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

  return (
    <Box>
      {/* ストーリー風アイコン（動的生成） */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, mb: 2 }}>
        {Array.from(
          new Map(posts.map(post => [post.user_id, post.profiles?.user_name || 'unknown'])).entries()
        ).map(([user_id, user_name]) => (
          <TimelinePost.StoryIcon key={user_id} label={user_name as string} img="/ホームアイコン.svg" />
        ))}
      </Box>
      {/* 投稿リスト */}
      {posts.map((post) => (
        <TimelinePost key={post.id} post={post} />
      ))}
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {hasMore && !loading && (
        <Button onClick={handleLoadMore} sx={{ display: 'block', mx: 'auto', my: 2 }}>
          さらに読み込む
        </Button>
      )}
    </Box>
  );
}