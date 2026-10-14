<?php

namespace Tests\Feature;

use App\Models\FocusArea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FocusAreaCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_focus_areas(): void
    {
        $this->get('/admin/focus-areas')->assertRedirect('/login');
    }

    public function test_unverified_users_cannot_manage_focus_areas(): void
    {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)->get('/admin/focus-areas')->assertRedirect(route('verification.notice'));
    }

    public function test_index_lists_focus_areas_in_sort_order(): void
    {
        FocusArea::factory()->create(['title' => 'Second', 'sort_order' => 2]);
        FocusArea::factory()->create(['title' => 'First', 'sort_order' => 1]);

        $this->actingAs($this->userWithPermission('manage focus areas'))
            ->get('/admin/focus-areas')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/focus-areas/index')
                ->has('focusAreas', 2)
                ->where('focusAreas.0.title', 'First')
                ->where('focusAreas.1.title', 'Second'));
    }

    public function test_focus_areas_can_be_created(): void
    {
        FocusArea::factory()->create(['sort_order' => 5]);

        $this->actingAs($this->userWithPermission('manage focus areas'))->post('/admin/focus-areas', [
            'icon' => 'education',
            'title' => 'New Focus Area',
            'text' => 'A short description.',
        ])->assertRedirect('/admin/focus-areas');

        $this->assertDatabaseHas('focus_areas', [
            'title' => 'New Focus Area',
            'icon' => 'education',
            'sort_order' => 6,
        ]);
    }

    public function test_focus_area_creation_requires_valid_data(): void
    {
        $this->actingAs($this->userWithPermission('manage focus areas'))
            ->post('/admin/focus-areas', ['title' => '', 'icon' => 'not-an-icon'])
            ->assertSessionHasErrors(['icon', 'title', 'text']);
    }

    public function test_focus_areas_can_be_updated(): void
    {
        $focusArea = FocusArea::factory()->create();

        $this->actingAs($this->userWithPermission('manage focus areas'))
            ->put("/admin/focus-areas/{$focusArea->id}", [
                'icon' => 'health',
                'title' => 'Updated Title',
                'text' => 'Updated description.',
            ])
            ->assertRedirect('/admin/focus-areas');

        $this->assertDatabaseHas('focus_areas', [
            'id' => $focusArea->id,
            'title' => 'Updated Title',
            'icon' => 'health',
        ]);
    }

    public function test_focus_areas_can_be_deleted(): void
    {
        $focusArea = FocusArea::factory()->create();

        $this->actingAs($this->userWithPermission('manage focus areas'))
            ->delete("/admin/focus-areas/{$focusArea->id}")
            ->assertRedirect('/admin/focus-areas');

        $this->assertDatabaseMissing('focus_areas', ['id' => $focusArea->id]);
    }

    public function test_focus_areas_can_be_reordered(): void
    {
        $first = FocusArea::factory()->create(['title' => 'First', 'sort_order' => 1]);
        $second = FocusArea::factory()->create(['title' => 'Second', 'sort_order' => 2]);
        $third = FocusArea::factory()->create(['title' => 'Third', 'sort_order' => 3]);

        $this->actingAs($this->userWithPermission('manage focus areas'))
            ->patch('/admin/focus-areas/reorder', ['ids' => [$third->id, $first->id, $second->id]])
            ->assertRedirect();

        $this->assertDatabaseHas('focus_areas', ['id' => $third->id, 'sort_order' => 1]);
        $this->assertDatabaseHas('focus_areas', ['id' => $first->id, 'sort_order' => 2]);
        $this->assertDatabaseHas('focus_areas', ['id' => $second->id, 'sort_order' => 3]);

        $this->get('/')
            ->assertInertia(fn ($page) => $page
                ->where('focusAreas.0.title', 'Third')
                ->where('focusAreas.1.title', 'First')
                ->where('focusAreas.2.title', 'Second'));
    }

    public function test_reorder_requires_valid_ids(): void
    {
        $this->actingAs($this->userWithPermission('manage focus areas'))
            ->patch('/admin/focus-areas/reorder', [])
            ->assertSessionHasErrors('ids');

        $this->actingAs($this->userWithPermission('manage focus areas'))
            ->patch('/admin/focus-areas/reorder', ['ids' => [99999]])
            ->assertSessionHasErrors('ids.0');
    }

    public function test_welcome_page_shows_focus_areas_in_sort_order(): void
    {
        FocusArea::factory()->create(['title' => 'Second', 'sort_order' => 2]);
        FocusArea::factory()->create(['title' => 'First', 'sort_order' => 1]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('welcome')
                ->has('focusAreas', 2)
                ->where('focusAreas.0.title', 'First')
                ->where('focusAreas.1.title', 'Second'));
    }
}
