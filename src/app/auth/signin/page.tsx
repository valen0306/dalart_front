'use client';

import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Link } from '@mui/material';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import LabeledInput from '../../components/auth/LabeledInput';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      // 1. ユーザー情報取得
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 2. profilesに既にレコードがあるか確認
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        // 3. なければINSERT
        if (!profile) {
          // 必要に応じてuser_nameなどを入力フォームから取得してください
          const defaultUserName = user.email?.split('@')[0] || 'user';
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                user_name: defaultUserName,
                // avatar_urlやbioなど他のカラムも必要に応じて追加
              },
            ]);
          if (insertError) {
            setError('プロフィール作成失敗: ' + insertError.message);
            return;
          }
        }
      }
      router.push('/');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F7F6F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, width: 340, bgcolor: '#FFFCF7' }}>
        <Typography align="center" sx={{ fontWeight: 700, fontSize: 22, mb: 2 }}>ログイン</Typography>
        <LabeledInput label="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        <LabeledInput label="パスワード" value={password} onChange={e => setPassword(e.target.value)} type="password" />
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Button fullWidth variant="contained" sx={{ bgcolor: '#859A93', color: '#fff', mt: 2, mb: 2 }} onClick={handleSignIn}>
          ログイン
        </Button>
        <Box sx={{ borderTop: '1px solid #ccc', my: 3 }} />
        <Typography align="center" sx={{ mb: 1 }}>初めての方はこちら</Typography>
        <Button fullWidth variant="outlined" sx={{ color: '#859A93', borderColor: '#859A93' }} component={Link} href="/auth/signup">
          新規アカウント登録
        </Button>
      </Paper>
    </Box>
  );
}