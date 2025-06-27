// components/Loading.tsx
'use client';

import React from 'react';
import Image from 'next/image';

const Loading: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-opacity-80" style={{ backgroundColor: '#FFFCF7' }}>
            {/* 回転アニメーション */}
            <div className="relative w-50 h-50">
                <div
                    className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
                    style={{
                        borderTopColor: 'transparent',
                        borderRightColor: '#859A93',
                        borderBottomColor: '#859A93',
                        borderLeftColor: '#859A93',
                    }}
                />

                {/* 中央の画像 */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src="/loading-icon.svg" // ← public フォルダに dog-icon.png を置いてください
                        alt="ローディングアイコン"
                        width={55}
                        height={55}
                    />
                </div>
            </div>
            <p
                className="mt-6 font-semibold text-3xl"
                style={{ color: '#544739' }} // ← ここで色を直接指定
            >loading...</p>
        </div>

    );
};

export default Loading;
