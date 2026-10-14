<?php

namespace Tests\Feature;

use App\Models\Enquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnquiryTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, string>
     */
    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Ram Bahadur',
            'email' => 'ram@example.com',
            'subject' => 'Volunteering',
            'message' => 'I would like to help with the next activity.',
        ], $overrides);
    }

    public function test_guest_can_submit_an_enquiry(): void
    {
        $this->post('/enquiries', $this->payload())
            ->assertRedirect();

        $this->assertDatabaseHas('enquiries', [
            'email' => 'ram@example.com',
            'subject' => 'Volunteering',
        ]);
    }

    public function test_enquiry_requires_valid_data(): void
    {
        $this->post('/enquiries', [])
            ->assertSessionHasErrors(['name', 'email', 'subject', 'message']);

        $this->post('/enquiries', $this->payload(['email' => 'not-an-email']))
            ->assertSessionHasErrors('email');
    }

    public function test_honeypot_submissions_are_not_stored(): void
    {
        $this->post('/enquiries', $this->payload(['website' => 'http://spam.example']))
            ->assertRedirect();

        $this->assertDatabaseCount('enquiries', 0);
    }

    public function test_enquiries_are_rate_limited(): void
    {
        for ($i = 0; $i < 3; $i++) {
            $this->post('/enquiries', $this->payload())->assertRedirect();
        }

        $this->post('/enquiries', $this->payload())->assertStatus(429);
    }

    public function test_guests_are_redirected_from_the_enquiry_inbox(): void
    {
        $this->get('/enquiries')->assertRedirect('/login');
    }

    public function test_index_lists_enquiries(): void
    {
        $enquiry = Enquiry::factory()->create();

        $this->actingAs($this->userWithPermission('manage enquiries'))
            ->get('/enquiries')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('enquiries/index')
                ->has('enquiries.data', 1)
                ->where('enquiries.data.0.id', $enquiry->id));
    }

    public function test_enquiry_can_be_marked_handled(): void
    {
        $enquiry = Enquiry::factory()->create();

        $this->actingAs($this->userWithPermission('manage enquiries'))
            ->patch("/enquiries/{$enquiry->id}")
            ->assertRedirect();

        $this->assertNotNull($enquiry->fresh()->handled_at);
    }

    public function test_enquiry_can_be_deleted(): void
    {
        $enquiry = Enquiry::factory()->create();

        $this->actingAs($this->userWithPermission('manage enquiries'))
            ->delete("/enquiries/{$enquiry->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('enquiries', ['id' => $enquiry->id]);
    }
}
