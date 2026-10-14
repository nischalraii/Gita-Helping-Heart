<?php

namespace App\Http\Controllers;

use App\Models\Enquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnquiryController extends Controller
{
    /**
     * Store a public enquiry submitted from the landing page.
     */
    public function store(Request $request): RedirectResponse
    {
        // Honeypot: real visitors never fill this off-screen field.
        if (filled($request->input('website'))) {
            return $this->submitted();
        }

        Enquiry::create($request->validate($this->rules()));

        return $this->submitted();
    }

    /**
     * List enquiries for the admin inbox.
     */
    public function index(): Response
    {
        return Inertia::render('enquiries/index', [
            'enquiries' => Enquiry::latest()->paginate(10),
        ]);
    }

    /**
     * Toggle an enquiry between handled and unhandled.
     */
    public function update(Enquiry $enquiry): RedirectResponse
    {
        $enquiry->update([
            'handled_at' => $enquiry->handled_at === null ? now() : null,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Enquiry updated.']);

        return back();
    }

    /**
     * Remove an enquiry.
     */
    public function destroy(Enquiry $enquiry): RedirectResponse
    {
        $enquiry->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Enquiry deleted.']);

        return back();
    }

    /**
     * Return the friendly confirmation shown after a successful submission.
     */
    private function submitted(): RedirectResponse
    {
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Thank you — your enquiry has been sent.']);

        return back();
    }

    /**
     * @return array<string, array<int, string>>
     */
    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'subject' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
        ];
    }
}
