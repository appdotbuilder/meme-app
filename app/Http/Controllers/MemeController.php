<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemeRequest;
use App\Models\Meme;
use App\Models\MemeLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MemeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $memes = Meme::with(['user', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate(10);

        // Add user like status if authenticated
        if (auth()->check()) {
            $userId = auth()->id();
            $memes->getCollection()->transform(function ($meme) use ($userId) {
                $meme->setAttribute('is_liked', $meme->likes()->where('user_id', $userId)->exists());
                return $meme;
            });
        }

        return Inertia::render('welcome', [
            'memes' => $memes,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('memes/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMemeRequest $request)
    {
        $imagePath = $request->file('image')->store('memes', 'public');

        $meme = Meme::create([
            'title' => $request->validated()['title'],
            'description' => $request->validated()['description'],
            'image_path' => $imagePath,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('memes.show', $meme)
            ->with('success', 'Meme uploaded successfully! 🎉');
    }

    /**
     * Display the specified resource.
     */
    public function show(Meme $meme)
    {
        $meme->load(['user', 'comments.user']);
        $meme->loadCount(['likes', 'comments']);

        if (auth()->check()) {
            $meme->setAttribute('is_liked', $meme->likes()->where('user_id', auth()->id())->exists());
        }

        return Inertia::render('memes/show', [
            'meme' => $meme,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Meme $meme)
    {
        if (auth()->id() !== $meme->user_id) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('memes/edit', [
            'meme' => $meme
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Meme $meme)
    {
        if (auth()->id() !== $meme->user_id) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $meme->update($request->only(['title', 'description']));

        return redirect()->route('memes.show', $meme)
            ->with('success', 'Meme updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Meme $meme)
    {
        if (auth()->id() !== $meme->user_id) {
            abort(403, 'Unauthorized');
        }

        // Delete the image file
        if (Storage::disk('public')->exists($meme->image_path)) {
            Storage::disk('public')->delete($meme->image_path);
        }

        $meme->delete();

        return redirect()->route('memes.index')
            ->with('success', 'Meme deleted successfully.');
    }
}