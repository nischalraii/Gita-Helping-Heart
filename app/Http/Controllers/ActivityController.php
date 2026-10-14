<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    /**
     * List all activities for the admin CRUD screen.
     */
    public function index(): Response
    {
        return Inertia::render('admin/activities/index', [
            'activities' => Activity::orderBy('id')->paginate(10),
        ]);
    }

    /**
     * Show the form to create an activity.
     */
    public function create(): Response
    {
        return Inertia::render('admin/activities/form');
    }

    /**
     * Store a newly created activity.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate($this->rules());

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('activities', 'public');
        }

        Activity::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Activity created.']);

        return to_route('admin.activities.index');
    }

    /**
     * Show the form to edit an activity.
     */
    public function edit(Activity $activity): Response
    {
        return Inertia::render('admin/activities/form', ['activity' => $activity]);
    }

    /**
     * Update an existing activity.
     */
    public function update(Request $request, Activity $activity): RedirectResponse
    {
        $data = $request->validate($this->rules());

        if ($request->hasFile('image')) {
            if ($activity->image) {
                Storage::disk('public')->delete($activity->image);
            }

            $data['image'] = $request->file('image')->store('activities', 'public');
        }

        $activity->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Activity updated.']);

        return to_route('admin.activities.index');
    }

    /**
     * Remove an activity.
     */
    public function destroy(Activity $activity): RedirectResponse
    {
        if ($activity->image) {
            Storage::disk('public')->delete($activity->image);
        }

        $activity->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Activity deleted.']);

        return to_route('admin.activities.index');
    }

    /**
     * @return array<string, array<string>>
     */
    private function rules(): array
    {
        return [
            'tag' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'date' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
