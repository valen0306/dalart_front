'use client';

import React, { useState } from 'react';
import { Box, Button, Typography, Paper, IconButton, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import LabeledInput from '../../components/auth/LabeledInput';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignUpPage() {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    setError('');
    if (form.password !== form.confirm) {
      setError('パスワードが一致しません');
      return;
    }
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name, username: form.username } }
    });
    if (error) {
      setError(error.message);
    } else {
      router.push('/auth/signin');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F7F6F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, width: 340, bgcolor: '#FFFCF7' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => router.back()}><ArrowBackIcon /></IconButton>
          <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1 }}>新規アカウント登録</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#E0DFDB' }} />
        </Box>
        <LabeledInput label="名前" name="name" value={form.name} onChange={handleChange} />
        <LabeledInput label="ユーザー名（半角英数字）" name="username" value={form.username} onChange={handleChange} />
        <LabeledInput label="メールアドレス" name="email" value={form.email} onChange={handleChange} type="email" />
        <LabeledInput label="パスワード（半角英数字）" name="password" value={form.password} onChange={handleChange} type="password" />
        <LabeledInput label="パスワード（再確認）" name="confirm" value={form.confirm} onChange={handleChange} type="password" />
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Button fullWidth variant="contained" sx={{ bgcolor: '#859A93', color: '#fff', mt: 2 }} onClick={handleSignUp}>
          新規登録
        </Button>
      </Paper>
    </Box>
  );
}