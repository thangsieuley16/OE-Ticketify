'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function DeleteBookingsPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/bookings', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete');
            }

            // Redirect on success
            router.push('/thangnc/bookings');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-[0_0_50px_rgba(255,0,0,0.1)]">
                <h1 className="text-2xl font-bold text-red-500 mb-2 uppercase tracking-wide text-center">
                    Cảnh báo nguy hiểm
                </h1>
                <p className="text-gray-400 text-sm text-center mb-8">
                    Hành động này sẽ xóa toàn bộ dữ liệu booking và không thể khôi phục.
                </p>

                <form onSubmit={handleDelete} className="space-y-6">
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">
                            Nhập mật khẩu xác nhận
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                            placeholder="Reviewer Password..."
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white border-none"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white border-none shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                        >
                            {isLoading ? 'Đang xóa...' : 'Xác nhận xóa'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
