<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemeCommentRequest;
use App\Models\Meme;
use App\Models\MemeComment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemeCommentController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMemeCommentRequest $request)
    {
        $request->validate([
            'meme_id' => 'required|exists:memes,id'
        ]);

        $meme = Meme::findOrFail($request->meme_id);

        MemeComment::create([
            'comment' => $request->validated()['comment'],
            'meme_id' => $meme->id,
            'user_id' => auth()->id(),
        ]);

        return back()->with('success', 'Comment added! 💬');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MemeComment $comment)
    {
        if (auth()->id() !== $comment->user_id) {
            abort(403, 'Unauthorized');
        }
        
        $comment->delete();

        return back()->with('success', 'Comment deleted.');
    }
}