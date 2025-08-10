<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Meme;
use App\Models\MemeLike;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemeLikeController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'meme_id' => 'required|exists:memes,id'
        ]);

        $meme = Meme::findOrFail($request->meme_id);
        $userId = auth()->id();

        // Check if already liked
        $existingLike = MemeLike::where('meme_id', $meme->id)
            ->where('user_id', $userId)
            ->first();

        if ($existingLike) {
            // Unlike
            $existingLike->delete();
            $meme->decrement('likes_count');
            $isLiked = false;
        } else {
            // Like
            MemeLike::create([
                'meme_id' => $meme->id,
                'user_id' => $userId,
            ]);
            $meme->increment('likes_count');
            $isLiked = true;
        }

        return back()->with([
            'message' => $isLiked ? 'Liked! 👍' : 'Unliked',
        ]);
    }
}