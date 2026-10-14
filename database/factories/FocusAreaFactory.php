<?php

namespace Database\Factories;

use App\Models\FocusArea;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FocusArea>
 */
class FocusAreaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'icon' => fake()->randomElement(['community', 'education', 'health', 'skills', 'environment', 'awareness']),
            'title' => fake()->sentence(3),
            'text' => fake()->paragraph(),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
