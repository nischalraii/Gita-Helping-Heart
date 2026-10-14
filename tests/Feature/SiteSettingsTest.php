<?php

namespace Tests\Feature;

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiteSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_site_settings(): void
    {
        $this->get('/site-settings')->assertRedirect('/login');
    }

    public function test_unverified_users_cannot_manage_site_settings(): void
    {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)->get('/site-settings')->assertRedirect(route('verification.notice'));
    }

    public function test_edit_page_shows_current_settings(): void
    {
        SiteSetting::current()->update(['address' => 'Existing Address']);

        $this->actingAs($this->userWithPermission('manage site settings'))
            ->get('/site-settings')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('site-settings/edit')
                ->where('settings.address', 'Existing Address'));
    }

    public function test_settings_can_be_updated(): void
    {
        $this->actingAs($this->userWithPermission('manage site settings'))
            ->patch('/site-settings', [
                'address' => 'New Address, Lalitpur',
                'address_short' => 'New Address',
                'email' => 'hello@example.org',
                'phone' => '+977 9800000000',
                'map_embed_url' => 'https://www.google.com/maps/embed?pb=abc',
                'facebook_url' => 'https://facebook.com/ghhn',
                'instagram_url' => 'https://instagram.com/ghhn',
                'youtube_url' => '',
                'tiktok_url' => '',
                'linkedin_url' => '',
                'twitter_url' => '',
                'whatsapp_url' => '',
            ])
            ->assertRedirect(route('site-settings.edit'));

        $this->assertDatabaseHas('site_settings', [
            'email' => 'hello@example.org',
            'facebook_url' => 'https://facebook.com/ghhn',
        ]);
    }

    public function test_settings_update_requires_valid_data(): void
    {
        $this->actingAs($this->userWithPermission('manage site settings'))
            ->patch('/site-settings', [
                'address' => '',
                'email' => 'not-an-email',
                'facebook_url' => 'not-a-url',
            ])
            ->assertSessionHasErrors(['address', 'email', 'facebook_url']);
    }

    public function test_landing_page_receives_settings(): void
    {
        SiteSetting::current()->update([
            'address' => 'Landing Address',
            'email' => 'landing@example.org',
            'instagram_url' => 'https://instagram.com/landing',
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('welcome')
                ->where('settings.address', 'Landing Address')
                ->where('settings.email', 'landing@example.org')
                ->where('settings.instagram_url', 'https://instagram.com/landing'));
    }
}
