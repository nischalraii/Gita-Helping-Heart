<?php

namespace App\Http\Controllers;

use App\Models\FocusArea;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FocusAreaController extends Controller
{
    /**
     * The available card icon keys, shared with the admin form.
     *
     * @var list<string>
     */
    public const ICONS = [
        'community',
        'education',
        'health',
        'skills',
        'environment',
        'awareness',
    ];

    /**
     * List all focus areas for the admin CRUD screen.
     */
    public function index(): Response
    {
        return Inertia::render('admin/focus-areas/index', [
            'focusAreas' => FocusArea::orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }

    /**
     * Show the form to create a focus area.
     */
    public function create(): Response
    {
        return Inertia::render('admin/focus-areas/form', [
            'icons' => self::ICONS,
        ]);
    }

    /**
     * Store a newly created focus area.
     */
    public function store(Request $request): RedirectResponse
    {
        FocusArea::create([
            ...$request->validate($this->rules()),
            'sort_order' => FocusArea::max('sort_order') + 1,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Focus area created.']);

        return to_route('admin.focus-areas.index');
    }

    /**
     * Show the form to edit a focus area.
     */
    public function edit(FocusArea $focusArea): Response
    {
        return Inertia::render('admin/focus-areas/form', [
            'focusArea' => $focusArea,
            'icons' => self::ICONS,
        ]);
    }

    /**
     * Update an existing focus area.
     */
    public function update(Request $request, FocusArea $focusArea): RedirectResponse
    {
        $focusArea->update($request->validate($this->rules()));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Focus area updated.']);

        return to_route('admin.focus-areas.index');
    }

    /**
     * Remove a focus area.
     */
    public function destroy(FocusArea $focusArea): RedirectResponse
    {
        $focusArea->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Focus area deleted.']);

        return to_route('admin.focus-areas.index');
    }

    /**
     * Persist a new display order for the focus areas.
     */
    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', Rule::exists('focus_areas', 'id')],
        ]);

        DB::transaction(function () use ($validated): void {
            foreach ($validated['ids'] as $position => $id) {
                FocusArea::whereKey($id)->update(['sort_order' => $position + 1]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Order updated.']);

        return back();
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    private function rules(): array
    {
        return [
            'icon' => ['required', 'string', Rule::in(self::ICONS)],
            'title' => ['required', 'string', 'max:255'],
            'text' => ['required', 'string'],
        ];
    }
}
