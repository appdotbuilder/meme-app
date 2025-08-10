<?php

namespace Database\Seeders;

use App\Models\Meme;
use App\Models\MemeComment;
use App\Models\MemeLike;
use App\Models\User;
use Illuminate\Database\Seeder;

class MemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some users first
        $users = User::factory(10)->create();

        // Create memes
        $memes = Meme::factory(15)
            ->recycle($users)
            ->create();

        // Create likes for memes
        foreach ($memes as $meme) {
            // Random number of likes per meme
            $likeCount = random_int(0, 8);
            $randomUsers = $users->random($likeCount);
            
            foreach ($randomUsers as $user) {
                MemeLike::create([
                    'meme_id' => $meme->id,
                    'user_id' => $user->id,
                ]);
            }
            
            // Update likes count
            $meme->update(['likes_count' => $likeCount]);
        }

        // Create comments for memes
        foreach ($memes as $meme) {
            $commentCount = random_int(0, 5);
            
            MemeComment::factory($commentCount)
                ->recycle($users)
                ->create(['meme_id' => $meme->id]);
        }
    }
}