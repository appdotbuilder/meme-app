import React from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';

interface Meme {
    id: number;
    title: string;
    description: string | null;
    image_path: string;
}

interface Props {
    meme: Meme;
    [key: string]: unknown;
}

export default function EditMeme({ meme }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        title: meme.title,
        description: meme.description || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/memes/${meme.id}`);
    };

    return (
        <AppShell>
            <Head title={`Edit: ${meme.title} - MemeHub`} />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center mb-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.get(`/memes/${meme.id}`)}
                            className="mr-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                        <h1 className="text-3xl font-bold">✏️ Edit Meme</h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Save className="mr-2 h-5 w-5" />
                                Edit Detail Meme
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                            {/* Current Image Preview */}
                            <div className="mb-6">
                                <Label>Gambar Saat Ini</Label>
                                <div className="mt-2">
                                    <img
                                        src={`/storage/${meme.image_path}`}
                                        alt={meme.title}
                                        className="w-full max-h-64 object-contain border-2 border-gray-200 rounded-lg"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        * Gambar tidak dapat diubah. Untuk mengganti gambar, silakan upload meme baru.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <Label htmlFor="title">Judul Meme *</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Berikan judul yang catchy untuk meme kamu..."
                                        className="mt-2"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description">Deskripsi (Opsional)</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Ceritakan konteks atau tambahkan keterangan lucu..."
                                        className="mt-2"
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.get(`/memes/${meme.id}`)}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing || !data.title.trim()}
                                        className="min-w-[120px]"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Simpan Perubahan
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}