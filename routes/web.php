<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');


    // Project Viewing
    Route::get('/projects', [ProjectController::class, 'index'])
        ->middleware('permission:view projects')
        ->name('projects.index');

    Route::get('/projects/card', [ProjectController::class, 'cardView'])
        ->middleware('permission:view projects')
        ->name('projects.card');


    // Project Create
    Route::get('/projects/create', [ProjectController::class, 'create'])
        ->middleware('permission:create projects')
        ->name('projects.create');

    Route::post('/projects', [ProjectController::class, 'store'])
        ->middleware('permission:create projects')
        ->name('projects.store');


    // Project Edit
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])
        ->middleware('permission:edit projects')
        ->name('projects.edit');

    Route::put('/projects/{project}', [ProjectController::class, 'update'])
        ->middleware('permission:edit projects')
        ->name('projects.update');


    // Project Delete
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])
        ->middleware('permission:delete projects')
        ->name('projects.destroy');


    // Task Viewing
    Route::get('/tasks', [TaskController::class, 'index'])
        ->middleware('permission:view tasks')
        ->name('tasks.index');


    // Task Create
    Route::get('/tasks/create', [TaskController::class, 'create'])
        ->middleware('permission:create tasks')
        ->name('tasks.create');

    Route::post('/tasks', [TaskController::class, 'store'])
        ->middleware('permission:create tasks')
        ->name('tasks.store');


    // Task Edit
    Route::get('/tasks/{task}/edit', [TaskController::class, 'edit'])
        ->middleware('permission:edit tasks')
        ->name('tasks.edit');

    Route::put('/tasks/{task}', [TaskController::class, 'update'])
        ->middleware('permission:edit tasks')
        ->name('tasks.update');


    // Task Delete
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])
        ->middleware('permission:delete tasks')
        ->name('tasks.destroy');
});

require __DIR__ . '/auth.php';