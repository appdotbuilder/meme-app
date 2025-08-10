<?php

use App\Http\Controllers\MemeController;
use App\Http\Controllers\MemeLikeController;
use App\Http\Controllers\MemeCommentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Main meme feed on homepage
Route::get('/', [MemeController::class, 'index'])->name('home');

// Public meme routes (show, index)
Route::get('/memes/{meme}', [MemeController::class, 'show'])->name('memes.show');

// Authentication required routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Meme management (create, store, edit, update, destroy)
    Route::get('/memes/create', [MemeController::class, 'create'])->name('memes.create');
    Route::post('/memes', [MemeController::class, 'store'])->name('memes.store');
    Route::get('/memes/{meme}/edit', [MemeController::class, 'edit'])->name('memes.edit');
    Route::patch('/memes/{meme}', [MemeController::class, 'update'])->name('memes.update');
    Route::delete('/memes/{meme}', [MemeController::class, 'destroy'])->name('memes.destroy');
    
    // Meme likes
    Route::post('/meme-likes', [MemeLikeController::class, 'store'])->name('meme-likes.store');
    
    // Meme comments
    Route::post('/meme-comments', [MemeCommentController::class, 'store'])->name('meme-comments.store');
    Route::delete('/meme-comments/{comment}', [MemeCommentController::class, 'destroy'])->name('meme-comments.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
