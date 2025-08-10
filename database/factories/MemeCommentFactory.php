<?php

namespace Database\Factories;

use App\Models\Meme;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MemeComment>
 */
class MemeCommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $comments = [
            'Hahahaha lucu banget! 😂',
            'Relatable sekali ini mah',
            'WKWKWK ngakak parah',
            'Gue banget nih 🤣',
            'Meme terbaik hari ini',
            'Ketawa sampai perut sakit',
            'Accurate banget sih',
            'Mood aku setiap hari',
            'Siapa yang bikin ini? Jenius!',
            'Save dulu ah, buat status WA',
            'Tag temen yang kayak gini',
            'Viral nih pasti',
            'Kentang banget 🥔',
            'Big mood energy',
            'Kok bisa tau hidup gue? 👀'
        ];

        return [
            'comment' => fake()->randomElement($comments),
            'meme_id' => Meme::factory(),
            'user_id' => User::factory(),
        ];
    }
}