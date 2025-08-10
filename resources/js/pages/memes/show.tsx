import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, ArrowLeft, Calendar, Send, Trash2, Edit } from 'lucide-react';

interface User {
    id: number;
    name: string;
}

interface Comment {
    id: number;
    comment: string;
    user: User;
    created_at: string;
}

interface Meme {
    id: number;
    title: string;
    description: string | null;
    image_path: string;
    likes_count: number;
    comments_count: number;
    is_liked?: boolean;
    user: User;
    created_at: string;
    comments: Comment[];
}

interface Props {
    meme: Meme;
    auth: {
        user: User | null;
    };
    [key: string]: unknown;
}

export default function ShowMeme({ meme, auth }: Props) {
    const [showComments, setShowComments] = useState(true);
    const { data, setData, processing, errors, reset } = useForm({
        comment: ''
    });

    const handleLike = () => {
        if (!auth.user) {
            router.get('/login');
            return;
        }
        
        router.post('/meme-likes', { meme_id: meme.id }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!auth.user) {
            router.get('/login');
            return;
        }

        router.post('/meme-comments', {
            ...data,
            meme_id: meme.id
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
            }
        });
    };

    const handleDeleteComment = (commentId: number) => {
        if (confirm('Yakin ingin menghapus komentar ini?')) {
            router.delete(`/meme-comments/${commentId}`, {
                preserveState: true,
                preserveScroll: true
            });
        }
    };

    const handleDeleteMeme = () => {
        if (confirm('Yakin ingin menghapus meme ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(`/memes/${meme.id}`);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppShell>
            <Head title={`${meme.title} - MemeHub`} />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.get('/')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Beranda
                        </Button>

                        {auth.user && auth.user.id === meme.user.id && (
                            <div className="space-x-2">
                                <Link href={`/memes/${meme.id}/edit`}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDeleteMeme}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Hapus
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Meme Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
                                        {meme.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{meme.user.name}</p>
                                        <p className="text-gray-500 text-sm flex items-center">
                                            <Calendar className="mr-1 h-4 w-4" />
                                            {formatDate(meme.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {/* Meme Image */}
                            <div className="w-full flex justify-center bg-gray-50">
                                <img
                                    src={`/storage/${meme.image_path}`}
                                    alt={meme.title}
                                    className="max-w-full max-h-[600px] object-contain"
                                />
                            </div>

                            {/* Meme Info */}
                            <div className="p-6">
                                <h1 className="text-2xl font-bold mb-3">{meme.title}</h1>
                                {meme.description && (
                                    <p className="text-gray-700 mb-4 leading-relaxed">
                                        {meme.description}
                                    </p>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="border-t">
                            <div className="flex items-center space-x-6 w-full">
                                <Button
                                    variant={meme.is_liked ? "default" : "ghost"}
                                    onClick={handleLike}
                                    className={`${meme.is_liked ? "text-red-500 bg-red-50 hover:bg-red-100" : ""}`}
                                >
                                    <Heart className={`mr-2 h-5 w-5 ${meme.is_liked ? 'fill-current' : ''}`} />
                                    {meme.likes_count} {meme.likes_count === 1 ? 'Like' : 'Likes'}
                                </Button>
                                
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowComments(!showComments)}
                                >
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    {meme.comments_count} Komentar
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Comments Section */}
                    {showComments && (
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold flex items-center">
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Komentar ({meme.comments_count})
                                </h3>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Add Comment Form */}
                                {auth.user ? (
                                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                                        <div className="flex space-x-3">
                                            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {auth.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <Textarea
                                                    value={data.comment}
                                                    onChange={(e) => setData('comment', e.target.value)}
                                                    placeholder="Tulis komentar lucu kamu..."
                                                    rows={3}
                                                    className="resize-none"
                                                />
                                                {errors.comment && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.comment}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={processing || !data.comment.trim()}
                                                size="sm"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                                        Mengirim...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="mr-2 h-4 w-4" />
                                                        Kirim Komentar
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                        <p className="text-gray-600 mb-4">Login untuk memberikan komentar</p>
                                        <div className="space-x-4">
                                            <Link href="/login">
                                                <Button size="sm">Login</Button>
                                            </Link>
                                            <Link href="/register">
                                                <Button variant="outline" size="sm">Daftar</Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Comments List */}
                                {meme.comments.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="text-4xl mb-4">😴</div>
                                        <p className="text-gray-600">Belum ada komentar</p>
                                        <p className="text-sm text-gray-500">Jadilah yang pertama berkomentar!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {meme.comments.map((comment) => (
                                            <div key={comment.id} className="flex space-x-3">
                                                <div className="bg-gray-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                    {comment.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <p className="font-semibold text-sm">{comment.user.name}</p>
                                                            <div className="flex items-center space-x-2">
                                                                <p className="text-xs text-gray-500">
                                                                    {formatDate(comment.created_at)}
                                                                </p>
                                                                {auth.user && auth.user.id === comment.user.id && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteComment(comment.id)}
                                                                        className="text-red-500 hover:text-red-700 p-1 h-auto"
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-700">{comment.comment}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppShell>
    );
}