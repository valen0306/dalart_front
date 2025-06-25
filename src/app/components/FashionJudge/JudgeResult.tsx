'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import ArrowDown from './ArrowDown';

type JudgeResultProps = {
  result: {
    label: string;
    reason: string;
    advice: string;
    image_url: string;
  };
  onRetake: () => void;
  onNext: () => void;
};

export default function JudgeResult({ result, onRetake, onNext }: JudgeResultProps) {
  const isDarui = result.label === 'ダル着';

  return (
    <Box sx={{ p: 2, minHeight: '100vh', bgcolor: '#FFFCF7', textAlign: 'center' }}>
      <Typography sx={{ fontFamily: 'Chewy, sans-serif', color: '#544739', fontSize: 28, mt: 2, mb: 1 }}>
        DaLert
      </Typography>
      <Box
        sx={{
          mx: 'auto',
          width: 220,
          height: 260,
          borderRadius: 5,
          border: '7px solid #8CA19B',
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          mb: 2,
        }}
      >
        <img src={result.image_url} alt="判定画像" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Box>
      <ArrowDown />
      <Box
        sx={{
          mx: 'auto',
          mt: 2,
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
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
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
          onClick={onNext}
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
          次へ進む
        </Button>
      </Box>
    </Box>
  );
}