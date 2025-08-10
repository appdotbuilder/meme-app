<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Meme>
 */
class MemeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $titles = [
            'Ketika deadline sudah dekat tapi masih santai',
            'Mood Monday morning be like',
            'Programmer vs Bug',
            'Ekspektasi vs Realita',
            'Ketika WiFi lemot di tengah meeting',
            'Saldo ATM vs Keinginan belanja',
            'Diet mulai hari Senin',
            'Tidur jam 2 pagi, bangun jam 5',
            'Lihat harga bensin hari ini',
            'Ketika teman bilang "bentar 5 menit"'
        ];

        $descriptions = [
            'Relatable banget kan? 😅',
            'Siapa yang merasakan hal yang sama?',
            'Pasti kalian pernah ngalamin ini',
            'Mood sehari-hari nih',
            'Kehidupan modern memang begini',
            'Struggle yang real banget',
            'Everyday life problems',
            'Meme ini menggambarkan hidup kita',
            null,
            null
        ];

        return [
            'title' => fake()->randomElement($titles),
            'description' => fake()->optional(0.7)->randomElement($descriptions),
            'image_path' => 'memes/sample-meme-' . fake()->numberBetween(1, 5) . '.jpg',
            'user_id' => User::factory(),
            'likes_count' => fake()->numberBetween(0, 100),
        ];
    }
}