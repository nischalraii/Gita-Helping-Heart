<?php

namespace Database\Factories;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Activity>
 */
class ActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tag' => fake()->randomElement(['Children', 'Healthcare', 'Environment']),
            'title' => fake()->sentence(4),
            'date' => fake()->monthName().' '.fake()->year(),
            'location' => fake()->city().' Village',
            'summary' => fake()->paragraph(),
            'description' => fake()->paragraphs(3, true),
            'image' => null,
        ];
    }
}
