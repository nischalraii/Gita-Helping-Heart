<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingsController extends Controller
{
    /**
     * Show the site contact settings form.
     */
    public function edit(): Response
    {
        return Inertia::render('site-settings/edit', [
            'settings' => SiteSetting::current(),
        ]);
    }

    /**
     * Update the site contact settings.
     */
    public function update(Request $request): RedirectResponse
    {
        SiteSetting::current()->update($request->validate($this->rules()));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Site settings updated.']);

        return to_route('site-settings.edit');
    }

    /**
     * @return array<string, array<int, string>>
     */
    private function rules(): array
    {
        $url = ['nullable', 'url', 'max:2048'];

        return [
            'address' => ['required', 'string', 'max:255'],
            'address_short' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'map_embed_url' => $url,
            'facebook_url' => $url,
            'instagram_url' => $url,
            'youtube_url' => $url,
            'tiktok_url' => $url,
            'linkedin_url' => $url,
            'twitter_url' => $url,
            'whatsapp_url' => $url,
        ];
    }
}
