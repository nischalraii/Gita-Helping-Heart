<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ActivityPageController;
use App\Http\Controllers\EnquiryController;
use App\Http\Controllers\FocusAreaController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SiteSettingsController;
use App\Http\Controllers\UserController;
use App\Models\Activity;
use App\Models\FocusArea;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'activities' => Activity::latest('id')->take(3)->get(),
        'focusAreas' => FocusArea::orderBy('sort_order')->orderBy('id')->get(),
        'settings' => SiteSetting::current(),
    ]);
})->name('home');

Route::get('activities', [ActivityPageController::class, 'index'])->name('activities.index');
Route::get('activities/{activity}', [ActivityPageController::class, 'show'])->name('activities.show');

Route::post('enquiries', [EnquiryController::class, 'store'])
    ->middleware('throttle:enquiries')
    ->name('enquiries.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('admin/activities', ActivityController::class)
        ->names('admin.activities')
        ->except('show')
        ->middleware('can:manage activities');

    Route::patch('admin/focus-areas/reorder', [FocusAreaController::class, 'reorder'])
        ->name('admin.focus-areas.reorder')
        ->middleware('can:manage focus areas');

    Route::resource('admin/focus-areas', FocusAreaController::class)
        ->names('admin.focus-areas')
        ->parameters(['focus-areas' => 'focusArea'])
        ->except('show')
        ->middleware('can:manage focus areas');

    Route::middleware('can:manage site settings')->group(function () {
        Route::get('site-settings', [SiteSettingsController::class, 'edit'])->name('site-settings.edit');
        Route::patch('site-settings', [SiteSettingsController::class, 'update'])->name('site-settings.update');
    });

    Route::middleware('can:manage enquiries')->group(function () {
        Route::get('enquiries', [EnquiryController::class, 'index'])->name('enquiries.index');
        Route::patch('enquiries/{enquiry}', [EnquiryController::class, 'update'])->name('enquiries.update');
        Route::delete('enquiries/{enquiry}', [EnquiryController::class, 'destroy'])->name('enquiries.destroy');
    });

    Route::middleware('role:Super Admin')->group(function () {
        Route::resource('admin/users', UserController::class)
            ->names('admin.users')
            ->except('show');

        Route::resource('admin/roles', RoleController::class)
            ->names('admin.roles')
            ->except('show');

        Route::get('admin/permissions', [PermissionController::class, 'index'])->name('admin.permissions.index');
        Route::post('admin/permissions', [PermissionController::class, 'store'])->name('admin.permissions.store');
        Route::delete('admin/permissions/{permission}', [PermissionController::class, 'destroy'])->name('admin.permissions.destroy');
    });
});

require __DIR__.'/settings.php';
