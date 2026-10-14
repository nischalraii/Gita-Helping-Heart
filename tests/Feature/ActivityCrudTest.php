<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ActivityCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_activities(): void
    {
        $this->get('/admin/activities')->assertRedirect('/login');
    }

    public function test_unverified_users_cannot_manage_activities(): void
    {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)->get('/admin/activities')->assertRedirect(route('verification.notice'));
    }

    public function test_index_lists_activities(): void
    {
        $activity = Activity::factory()->create();

        $this->actingAs($this->userWithPermission('manage activities'))
            ->get('/admin/activities')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/activities/index')
                ->has('activities.data', 1)
                ->where('activities.data.0.title', $activity->title)
                ->where('activities.last_page', 1));
    }

    public function test_activities_index_is_paginated(): void
    {
        Activity::factory()->count(11)->create();

        $this->actingAs($this->userWithPermission('manage activities'))
            ->get('/admin/activities')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('activities.data', 10)
                ->where('activities.last_page', 2));

        $this->get('/admin/activities?page=2')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('activities.data', 1));
    }

    public function test_activities_can_be_created(): void
    {
        Storage::fake('public');

        $this->actingAs($this->userWithPermission('manage activities'))->post('/admin/activities', [
            'tag' => 'Children',
            'title' => 'New Activity',
            'date' => 'Oct 2026',
            'location' => 'Kathmandu',
            'summary' => 'A short summary.',
            'description' => 'A longer description.',
            'image' => UploadedFile::fake()->create('activity.jpg', 100),
        ])->assertRedirect('/admin/activities');

        $this->assertDatabaseHas('activities', [
            'title' => 'New Activity',
            'description' => 'A longer description.',
        ]);
        Storage::disk('public')->assertExists(Activity::first()->image);
    }

    public function test_activity_creation_requires_valid_data(): void
    {
        $this->actingAs($this->userWithPermission('manage activities'))
            ->post('/admin/activities', ['title' => ''])
            ->assertSessionHasErrors(['tag', 'title', 'date', 'location', 'summary']);
    }

    public function test_activities_can_be_updated(): void
    {
        $activity = Activity::factory()->create();

        $this->actingAs($this->userWithPermission('manage activities'))
            ->put("/admin/activities/{$activity->id}", [
                'tag' => 'Healthcare',
                'title' => 'Updated Title',
                'date' => 'Nov 2026',
                'location' => 'Pokhara',
                'summary' => 'Updated summary.',
            ])
            ->assertRedirect('/admin/activities');

        $this->assertDatabaseHas('activities', ['id' => $activity->id, 'title' => 'Updated Title']);
    }

    public function test_activities_can_be_deleted(): void
    {
        $activity = Activity::factory()->create();

        $this->actingAs($this->userWithPermission('manage activities'))
            ->delete("/admin/activities/{$activity->id}")
            ->assertRedirect('/admin/activities');

        $this->assertDatabaseMissing('activities', ['id' => $activity->id]);
    }

    public function test_welcome_page_shows_only_the_latest_three_activities(): void
    {
        Activity::factory()->create(['title' => 'Oldest']);
        Activity::factory()->create(['title' => 'Second']);
        Activity::factory()->create(['title' => 'Third']);
        Activity::factory()->create(['title' => 'Newest']);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('welcome')
                ->has('activities', 3)
                ->where('activities.0.title', 'Newest')
                ->where('activities.2.title', 'Second'));
    }
}
