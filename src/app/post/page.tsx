"use client";

import React, { useRef, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

export default function PostPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);

  // カメラ起動
  const startCamera = async () => {
    setCameraOn(true);
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
    startCamera();
  };

  return (
    <Box sx={{ p: 2, minHeight: '100vh', bgcolor: '#FFFCF7', textAlign: 'center' }}>
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
        {/* 吹き出しの三角 */}
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
        {/* 1. 撮影後は画像表示 */}
        {photo && (
          <img
            src={photo}
            alt="撮影画像"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        {/* 2. カメラ起動中はvideo表示 */}
        {!photo && cameraOn && (
          <video
            ref={videoRef}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            autoPlay
            playsInline
          />
        )}
        {/* 3. 何もない時はカメラアイコン */}
        {!photo && !cameraOn && (
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
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Box>

      {/* 丸いシャッターボタン or 再撮影ボタン */}
      {!photo && cameraOn && (
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
      {photo && (
        <>
          <Button
            onClick={retake}
            variant="outlined"
            sx={{
              mt: 2,
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
            もう一度撮影
          </Button>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: '#8CA19B',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 3,
              px: 4,
              py: 1,
              fontSize: 18,
              '&:hover': { bgcolor: '#6B857A' },
              display: 'block',
              mx: 'auto'
            }}
            onClick={() => {
              // 投稿処理をここに記述
              alert('投稿しました！（ダミー）');
            }}
          >
            投稿
          </Button>
        </>
      )}
    </Box>
  );
}