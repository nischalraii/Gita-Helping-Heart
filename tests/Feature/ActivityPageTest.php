<?php

namespace Tests\Feature;

use App\Models\Activity;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_activity_list_page_shows_all_activities(): void
    {
        Activity::factory()->count(3)->create();

        $this->get('/activities')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('activities/index')
                ->has('activities', 3)
                ->has('settings'));
    }

    public function test_activity_list_is_ordered_newest_first(): void
    {
        Activity::factory()->create(['title' => 'Older']);
        Activity::factory()->create(['title' => 'Newer']);

        $this->get('/activities')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('activities.0.title', 'Newer'));
    }

    public function test_activity_detail_page_shows_the_activity(): void
    {
        $activity = Activity::factory()->create([
            'title' => 'Health Camp',
            'description' => 'A full day of free check-ups.',
        ]);

        $this->get("/activities/{$activity->id}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('activities/show')
                ->where('activity.title', 'Health Camp')
                ->where('activity.description', 'A full day of free check-ups.')
                ->has('settings'));
    }

    public function test_activity_detail_page_returns_404_for_unknown_activity(): void
    {
        $this->get('/activities/999')->assertNotFound();
    }

    public function test_activity_detail_page_lists_related_activities(): void
    {
        $current = Activity::factory()->create(['title' => 'Current', 'tag' => 'Healthcare']);
        Activity::factory()->create(['title' => 'Related One', 'tag' => 'Healthcare']);
        Activity::factory()->create(['title' => 'Related Two', 'tag' => 'Healthcare']);
        Activity::factory()->create(['title' => 'Related Three', 'tag' => 'Healthcare']);
        Activity::factory()->create(['title' => 'Related Four', 'tag' => 'Healthcare']);

        $this->get("/activities/{$current->id}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('activities/show')
                ->has('related', 3)
                ->where('related.0.title', 'Related Four')
                ->where('related', fn ($related) => collect($related)
                    ->pluck('id')
                    ->doesntContain($current->id)));
    }

    public function test_related_activities_prefer_same_tag_then_latest(): void
    {
        $current = Activity::factory()->create(['title' => 'Current', 'tag' => 'Healthcare']);
        Activity::factory()->create(['title' => 'Health A', 'tag' => 'Healthcare']);
        Activity::factory()->create(['title' => 'Health B', 'tag' => 'Healthcare']);
        Activity::factory()->create(['title' => 'Other X', 'tag' => 'Environment']);
        Activity::factory()->create(['title' => 'Other Y', 'tag' => 'Environment']);
        Activity::factory()->create(['title' => 'Other Z', 'tag' => 'Environment']);

        $this->get("/activities/{$current->id}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('activities/show')
                ->has('related', 3)
                ->where('related.0.title', 'Health B')
                ->where('related.1.title', 'Health A')
                ->where('related.2.title', 'Other Z'));
    }
}
