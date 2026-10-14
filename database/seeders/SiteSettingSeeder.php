<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Ensure the single site settings row exists with sensible defaults.
     */
    public function run(): void
    {
        SiteSetting::current();
    }
}
