<?php

use App\Models\Meme;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('can view meme feed', function () {
    $user = User::factory()->create();
    Meme::factory(3)->for($user)->create();

    $response = $this->get('/');

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('memes.data', 3)
        );
});

test('authenticated user can create meme', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $image = UploadedFile::fake()->image('meme.jpg');

    $response = $this->actingAs($user)->post('/memes', [
        'title' => 'Funny Meme Title',
        'description' => 'This is a funny meme',
        'image' => $image,
    ]);

    $response->assertRedirect();
    expect(Meme::where('title', 'Funny Meme Title')->where('user_id', $user->id)->exists())->toBeTrue();
    Storage::disk('public')->assertExists('memes/' . $image->hashName());
});

test('can like and unlike meme', function () {
    $user = User::factory()->create();
    $meme = Meme::factory()->create();

    // Like meme
    $response = $this->actingAs($user)->post('/meme-likes', [
        'meme_id' => $meme->id,
    ]);

    $response->assertRedirect();
    expect(\App\Models\MemeLike::where('user_id', $user->id)->where('meme_id', $meme->id)->exists())->toBeTrue();

    // Unlike meme
    $response = $this->actingAs($user)->post('/meme-likes', [
        'meme_id' => $meme->id,
    ]);

    $response->assertRedirect();
    expect(\App\Models\MemeLike::where('user_id', $user->id)->where('meme_id', $meme->id)->exists())->toBeFalse();
});

test('can comment on meme', function () {
    $user = User::factory()->create();
    $meme = Meme::factory()->create();

    $response = $this->actingAs($user)->post('/meme-comments', [
        'comment' => 'Haha this is funny!',
        'meme_id' => $meme->id,
    ]);

    $response->assertRedirect();
    expect(\App\Models\MemeComment::where('comment', 'Haha this is funny!')
        ->where('user_id', $user->id)
        ->where('meme_id', $meme->id)
        ->exists())->toBeTrue();
});

test('user can only edit own memes', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $meme = Meme::factory()->for($otherUser)->create();

    $response = $this->actingAs($user)->get("/memes/{$meme->id}/edit");

    $response->assertStatus(403);
});

test('user can edit own meme', function () {
    $user = User::factory()->create();
    $meme = Meme::factory()->for($user)->create();

    $response = $this->actingAs($user)->patch("/memes/{$meme->id}", [
        'title' => 'Updated Title',
        'description' => 'Updated description',
    ]);

    $response->assertRedirect();
    expect(Meme::where('id', $meme->id)
        ->where('title', 'Updated Title')
        ->where('description', 'Updated description')
        ->exists())->toBeTrue();
});

test('guest can view memes but cannot interact', function () {
    Meme::factory(2)->create();

    $response = $this->get('/');
    $response->assertStatus(200);

    // Cannot like without auth
    $meme = Meme::first();
    $response = $this->post('/meme-likes', ['meme_id' => $meme->id]);
    $response->assertRedirect('/login');

    // Cannot comment without auth  
    $response = $this->post('/meme-comments', [
        'comment' => 'Test comment',
        'meme_id' => $meme->id,
    ]);
    $response->assertRedirect('/login');
});