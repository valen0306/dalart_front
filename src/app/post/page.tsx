'use client';

import React, { useRef, useState } from 'react';
import { Box, Button, IconButton, Typography, CircularProgress } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import JudgeResult from '../components/FashionJudge/JudgeResult';
import Footer from '../components/BottomNavigationBar';
import Header from '../components/Header';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export default function PostPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // カメラ起動
  const startCamera = async () => {
    setCameraOn(true);
    setResult(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    }
  };

  // 撮影
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setPhoto(dataUrl);
      }
    }
    // カメラストリーム停止
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraOn(false);
  };

  // 再撮影
  const retake = () => {
    setPhoto(null);
    setResult(null);
    setError('');
    startCamera();
  };

  // 判定ボタン
  const handleJudge = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Supabase AuthのJWT取得
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        setError('認証情報が取得できませんでした。再ログインしてください。');
        setLoading(false);
        return;
      }

      // 2. dataURL→Blob変換
      if (!photo) {
        setError('画像がありません');
        setLoading(false);
        return;
      }
      const blob = await (await fetch(photo)).blob();
      const file = new File([blob], 'photo.png', { type: 'image/png' });

      // 3. multipart/form-dataでAPIにPOST
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('https://dalert-api.onrender.com/predict', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Content-TypeはFormData利用時は自動で付与されるので不要
        },
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setError(data.error || '判定APIでエラーが発生しました');
        setLoading(false);
        return;
      }

      // 4. レスポンスをそのままセット
      setResult(data);
    } catch (e) {
      setError('判定に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 初期表示・撮影・判定前
  if (!photo && !result) {
    return (
      <>
        <Header />
        <Box sx={{ p: 2, minHeight: '100vh', bgcolor: '#FFFCF7', textAlign: 'center', pb: 8 }}>
          {/* 吹き出し */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <Box
              sx={{
                bgcolor: '#8CA19B',
                color: '#fff',
                px: 4,
                py: 1.2,
                borderRadius: 2,
                fontSize: 22,
                fontWeight: 500,
                mb: 0.5,
                position: 'relative',
                zIndex: 1,
              }}
            >
              今日の服装は？？
            </Box>
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '18px solid transparent',
                borderRight: '18px solid transparent',
                borderTop: '18px solid #8CA19B',
                marginTop: '-2px',
                marginBottom: 2,
              }}
            />
          </Box>
          {/* プレビュー枠 */}
          <Box
            sx={{
              mx: 'auto',
              width: 280,
              height: 340,
              borderRadius: 5,
              border: '7px solid #8CA19B',
              bgcolor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              mb: 4,
            }}
          >
            {!cameraOn && (
              <IconButton
                onClick={startCamera}
                sx={{
                  bgcolor: '#8CA19B',
                  color: '#fff',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  '&:hover': { bgcolor: '#6B857A' },
                  fontSize: 48,
                }}
              >
                <CameraAltIcon sx={{ fontSize: 48 }} />
              </IconButton>
            )}
            {cameraOn && (
              <video
                ref={videoRef}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                autoPlay
                playsInline
              />
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </Box>
          {/* シャッターボタン */}
          {cameraOn && (
            <IconButton
              onClick={takePhoto}
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                border: '7px solid #8CA19B',
                bgcolor: 'transparent',
                mb: 2,
              }}
            />
          )}
        </Box>
        <Footer />
      </>
    );
  }

  // 撮影後・判定前
  if (photo && !result) {
    return (
      <>
        <Header/>
        <Box sx={{ p: 2, minHeight: '100vh', bgcolor: '#FFFCF7', textAlign: 'center', pb: 8 }}>
          
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
              mb: 3,
            }}
          >
            <img src={photo} alt="撮影画像" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
            <Button
              onClick={retake}
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
              onClick={handleJudge}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : '判定する'}
            </Button>
          </Box>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
        <Footer />
      </>
    );
  }

  // 判定結果画面
  if (result) {
    return (
      <>
        <Header/>
        <Box sx={{ p: 2, minHeight: '100vh', bgcolor: '#FFFCF7', textAlign: 'center', pb: 8 }}>
          <JudgeResult
            result={result}
            onRetake={retake}
            onPost={() => {
              // 投稿処理
              setPhoto(null);
              setResult(null);
            }}
          />
        </Box>
        <Footer />
      </>
    );
  }

  return null;
}