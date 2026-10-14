<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\SiteSetting;
use Illuminate\Database\Eloquent\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ActivityPageController extends Controller
{
    /**
     * List every activity on the public site.
     */
    public function index(): Response
    {
        return Inertia::render('activities/index', [
            'activities' => Activity::latest('id')->get(),
            'settings' => SiteSetting::current(),
        ]);
    }

    /**
     * Show a single activity.
     */
    public function show(Activity $activity): Response
    {
        return Inertia::render('activities/show', [
            'activity' => $activity,
            'related' => $this->relatedActivities($activity),
            'settings' => SiteSetting::current(),
        ]);
    }

    /**
     * Prefer activities sharing the current activity's tag, then fill with the
     * latest activities so the list holds up to three.
     *
     * @return Collection<int, Activity>
     */
    private function relatedActivities(Activity $activity): Collection
    {
        $sameTag = Activity::whereKeyNot($activity->id)
            ->where('tag', $activity->tag)
            ->latest('id')
            ->take(3)
            ->get();

        if ($sameTag->count() >= 3) {
            return $sameTag;
        }

        $filler = Activity::whereKeyNot($activity->id)
            ->whereNotIn('id', $sameTag->pluck('id'))
            ->latest('id')
            ->take(3 - $sameTag->count())
            ->get();

        return $sameTag->concat($filler);
    }
}
