<?php

namespace Database\Seeders;

use App\Models\Activity;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    /**
     * Seed the activities currently hardcoded on the landing page.
     */
    public function run(): void
    {
        $items = [
            [
                'tag' => 'Children',
                'title' => 'Weekend Learning Support Camp',
                'date' => 'Aug 2026',
                'location' => 'Rampur Village',
                'summary' => 'Volunteers ran reading and maths sessions for 45 children from nearby settlements, with stationery support provided by a local donor.',
                'image' => '/photos/activity-children.jpg',
            ],
            [
                'tag' => 'Healthcare',
                'title' => 'Free Health Check-up Drive',
                'date' => 'Jul 2026',
                'location' => 'Sundarpur Block',
                'summary' => 'A team of volunteer doctors offered basic check-ups and health advice to over 120 residents, with referrals arranged where needed.',
                'image' => '/photos/activity-care.jpg',
            ],
            [
                'tag' => 'Environment',
                'title' => 'Tree Plantation & Clean-up',
                'date' => 'Jun 2026',
                'location' => 'Riverside Park',
                'summary' => 'Community volunteers planted 200 saplings and cleared plastic waste along the riverbank as part of the annual environment campaign.',
                'image' => '/photos/activity-environment.jpg',
            ],
        ];

        foreach ($items as $item) {
            Activity::firstOrCreate(['title' => $item['title']], $item);
        }
    }
}
