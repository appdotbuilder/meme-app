import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Image as ImageIcon, ArrowLeft } from 'lucide-react';

export default function CreateMeme() {
    const [preview, setPreview] = useState<string | null>(null);
    const { data, setData, processing, errors } = useForm({
        title: '',
        description: '',
        image: null as File | null
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        if (data.image) {
            formData.append('image', data.image);
        }

        router.post('/memes', formData, {
            forceFormData: true,
            preserveState: false
        });
    };

    return (
        <AppShell>
            <Head title="Upload Meme Baru - MemeHub" />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center mb-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.get('/')}
                            className="mr-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                        <h1 className="text-3xl font-bold">📤 Upload Meme Baru</h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Upload className="mr-2 h-5 w-5" />
                                Bagikan Meme Lucu Kamu
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Image Upload */}
                                <div>
                                    <Label htmlFor="image">Gambar Meme *</Label>
                                    <div className="mt-2">
                                        {preview ? (
                                            <div className="relative">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-full max-h-96 object-contain border-2 border-dashed border-gray-300 rounded-lg"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => {
                                                        setPreview(null);
                                                        setData('image', null);
                                                    }}
                                                >
                                                    Ganti
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                                                <div className="text-center">
                                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                                    <div className="text-sm text-gray-600 mb-4">
                                                        <label htmlFor="image" className="cursor-pointer">
                                                            <span className="text-blue-600 hover:text-blue-500">
                                                                Klik untuk upload
                                                            </span>
                                                            {' '}atau drag & drop
                                                        </label>
                                                        <input
                                                            id="image"
                                                            type="file"
                                                            className="sr-only"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, GIF, WebP hingga 10MB
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.image && (
                                        <p className="text-sm text-red-600 mt-1">{errors.image}</p>
                                    )}
                                </div>

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
                                        onClick={() => router.get('/')}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing || !data.image || !data.title}
                                        className="min-w-[120px]"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Meme
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Tips */}
                    <Card className="mt-6 bg-blue-50">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold mb-3 text-blue-800">💡 Tips untuk Meme yang Viral:</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Gunakan gambar yang jelas dan mudah dibaca</li>
                                <li>• Buat judul yang catchy dan mengundang tawa</li>
                                <li>• Pastikan meme relate dengan situasi terkini</li>
                                <li>• Jangan lupa cek spelling dan grammar</li>
                                <li>• Hindari konten yang menyinggung atau berbahaya</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}