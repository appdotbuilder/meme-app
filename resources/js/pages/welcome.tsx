import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Heart, MessageCircle, Upload, User, Calendar } from 'lucide-react';

interface Meme {
    id: number;
    title: string;
    description: string | null;
    image_path: string;
    likes_count: number;
    comments_count: number;
    is_liked?: boolean;
    user: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface Props {
    memes: {
        data: Meme[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        meta: {
            current_page: number;
            last_page: number;
            total: number;
        };
    };
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    [key: string]: unknown;
}

export default function Welcome({ memes, auth }: Props) {
    const handleLike = (memeId: number) => {
        if (!auth.user) {
            router.get('/login');
            return;
        }
        
        router.post('/meme-likes', { meme_id: memeId }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <AppShell>
            <Head title="🤣 MemeHub - Share Your Memes" />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        🤣 MemeHub
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                        Platform terbaik untuk berbagi meme lucu dan menghibur! 
                        Upload, lihat, like, dan komentar meme favorit kamu.
                    </p>
                    
                    {!auth.user ? (
                        <div className="space-x-4">
                            <Link href="/login">
                                <Button size="lg" variant="secondary">
                                    🔑 Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
                                    ✨ Daftar Sekarang
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/memes/create">
                            <Button size="lg" variant="secondary">
                                <Upload className="mr-2 h-5 w-5" />
                                Upload Meme Baru
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">✨ Fitur Utama</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Upload className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold mb-2">📤 Upload Meme</h3>
                            <p className="text-gray-600">Upload meme lucu kamu dan bagikan ke komunitas</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Heart className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="font-semibold mb-2">❤️ Like & Share</h3>
                            <p className="text-gray-600">Berikan like pada meme yang kamu suka</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <MessageCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="font-semibold mb-2">💬 Komentar</h3>
                            <p className="text-gray-600">Tinggalkan komentar lucu di meme favorit</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <User className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="font-semibold mb-2">👥 Komunitas</h3>
                            <p className="text-gray-600">Bergabung dengan komunitas pencinta meme</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Memes Feed */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">🔥 Meme Terbaru</h2>
                    {auth.user && (
                        <Link href="/memes/create">
                            <Button>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Meme
                            </Button>
                        </Link>
                    )}
                </div>

                {memes.data.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">😴</div>
                        <h3 className="text-2xl font-bold mb-2">Belum ada meme</h3>
                        <p className="text-gray-600 mb-8">Jadilah yang pertama upload meme lucu!</p>
                        {auth.user && (
                            <Link href="/memes/create">
                                <Button size="lg">
                                    <Upload className="mr-2 h-5 w-5" />
                                    Upload Meme Pertama
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {memes.data.map((meme) => (
                            <Card key={meme.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                                            {meme.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{meme.user.name}</p>
                                            <p className="text-gray-500 text-xs flex items-center">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                {formatDate(meme.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="p-0">
                                    <Link href={`/memes/${meme.id}`}>
                                        <img
                                            src={`/storage/${meme.image_path}`}
                                            alt={meme.title}
                                            className="w-full h-64 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                        />
                                    </Link>
                                    <div className="p-4">
                                        <Link href={`/memes/${meme.id}`}>
                                            <h3 className="font-bold text-lg mb-2 hover:text-blue-600 cursor-pointer">
                                                {meme.title}
                                            </h3>
                                        </Link>
                                        {meme.description && (
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {meme.description}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                                
                                <CardFooter className="pt-0 px-4 pb-4">
                                    <div className="flex items-center space-x-4 w-full">
                                        <Button
                                            variant={meme.is_liked ? "default" : "ghost"}
                                            size="sm"
                                            onClick={() => handleLike(meme.id)}
                                            className={meme.is_liked ? "text-red-500" : ""}
                                        >
                                            <Heart className={`mr-1 h-4 w-4 ${meme.is_liked ? 'fill-current' : ''}`} />
                                            {meme.likes_count} {meme.likes_count === 1 ? 'Like' : 'Likes'}
                                        </Button>
                                        
                                        <Link href={`/memes/${meme.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <MessageCircle className="mr-1 h-4 w-4" />
                                                {meme.comments_count} {meme.comments_count === 1 ? 'Komentar' : 'Komentar'}
                                            </Button>
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {memes.data.length > 0 && memes.links.length > 3 && (
                    <div className="flex justify-center mt-12">
                        <div className="flex space-x-2">
                            {memes.links.map((link, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 text-sm border rounded-md ${
                                        link.active
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    } ${
                                        !link.url ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    preserveState
                                    preserveScroll
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Call to Action */}
            {!auth.user && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">🚀 Siap Bergabung?</h2>
                        <p className="text-xl mb-8">
                            Daftar sekarang dan mulai berbagi meme lucu dengan komunitas!
                        </p>
                        <div className="space-x-4">
                            <Link href="/register">
                                <Button size="lg" variant="secondary">
                                    ✨ Daftar Gratis
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                                    🔑 Sudah Punya Akun?
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </AppShell>
    );
}