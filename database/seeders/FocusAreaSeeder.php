<?php

namespace Database\Seeders;

use App\Models\FocusArea;
use Illuminate\Database\Seeder;

class FocusAreaSeeder extends Seeder
{
    /**
     * Seed the "Where We Focus" program areas currently shown on the landing page.
     */
    public function run(): void
    {
        $items = [
            [
                'icon' => 'community',
                'title' => 'Women & Vulnerable People',
                'text' => 'Empowerment, social support, skills and opportunities for women, persons with disabilities and disadvantaged people.',
            ],
            [
                'icon' => 'education',
                'title' => 'Children & Education',
                'text' => 'Projects that help vulnerable children develop into confident, capable and responsible citizens.',
            ],
            [
                'icon' => 'health',
                'title' => 'Health & Blood Donation',
                'text' => 'Free health camps, blood donation and community health awareness in coordination with qualified partners.',
            ],
            [
                'icon' => 'skills',
                'title' => 'Skills & Livelihoods',
                'text' => 'Practical training, handicrafts, agriculture and cottage-industry activities that encourage self-reliance.',
            ],
            [
                'icon' => 'environment',
                'title' => 'Environment & Clean Communities',
                'text' => 'Tree plantation, environmental conservation, cleanliness campaigns and local community-improvement activities.',
            ],
            [
                'icon' => 'awareness',
                'title' => 'Awareness & Partnerships',
                'text' => 'Public-awareness programs, social development training and collaboration with compatible organizations.',
            ],
        ];

        foreach ($items as $index => $item) {
            FocusArea::firstOrCreate(
                ['title' => $item['title']],
                [...$item, 'sort_order' => $index + 1],
            );
        }
    }
}
