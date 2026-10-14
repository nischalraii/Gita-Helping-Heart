<?php

namespace Database\Seeders;

use App\Models\Enquiry;
use Illuminate\Database\Seeder;

class EnquirySeeder extends Seeder
{
    /**
     * Seed sample enquiries for the admin inbox.
     */
    public function run(): void
    {
        Enquiry::factory()
            ->count(34)
            ->create()
            ->each(function (Enquiry $enquiry, int $index): void {
                if ($index % 3 === 0) {
                    $enquiry->update(['handled_at' => now()]);
                }
            });
    }
}
