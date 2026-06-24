<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Team;
use App\Models\Client;
use App\Models\Tag;
use App\Models\User;
use Inertia\Inertia;

class ProjectController extends Controller
{
    // ─── Shared dropdown data ────────────────────────────────
    private function getFormData(): array
    {
        return [
            'teams'        => Team::select('id', 'name')->get(),
            'clients'      => Client::select('id', 'name')->get(),
            'tags'         => Tag::select('id', 'name')->get(),
            'users'        => User::select('id', 'name')->get(),
            'admins'       => User::select('id', 'name')->where('role', 'admin')->get(),
            'taskViews'    => ['technical', 'external', 'organizational'],
            'privacyOptions' => ['Data Privacy One', 'Data Privacy Two', 'Data Privacy Three'],
        ];
    }

    // ─── Index ───────────────────────────────────────────────
    public function index()
    {
        $projects = Project::with([
            'team',
            'client',
            'projectLead',
            'users',
            'tags',
        ])->get();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    // ─── Create ──────────────────────────────────────────────
    public function create()
    {
        return Inertia::render('Projects/Create', $this->getFormData());
    }

    // ─── Store ───────────────────────────────────────────────
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'description'       => 'nullable|string',
            'status'            => 'required|in:active,completed,on-hold',
            'privacy'           => 'nullable|string',
            'default_task_view' => 'nullable|string',
            'team_id'           => 'nullable|exists:teams,id',
            'project_lead_id'   => 'nullable|exists:users,id',
            'start_date'        => 'nullable|date',
            'end_date'          => 'nullable|date|after_or_equal:start_date',
            'description'       => 'nullable|string',  // project overview
            'client_id'         => 'nullable|exists:clients,id',
            'budget'            => 'nullable|numeric|min:0',
            'people'            => 'nullable|array',
            'people.*'          => 'exists:users,id',
            'tags'              => 'nullable|array',
            'tags.*'            => 'exists:tags,id',
        ]);

        $project = Project::create([
            'name'              => $validated['name'],
            'description'       => $validated['description'] ?? null,
            'status'            => $validated['status'],
            'privacy'           => $validated['privacy'] ?? null,
            'default_task_view' => $validated['default_task_view'] ?? null,
            'team_id'           => $validated['team_id'] ?? null,
            'project_lead_id'   => $validated['project_lead_id'] ?? null,
            'start_date'        => $validated['start_date'] ?? null,
            'end_date'          => $validated['end_date'] ?? null,
            'client_id'         => $validated['client_id'] ?? null,
            'budget'            => $validated['budget'] ?? null,
            'created_by'        => auth()->id(),
        ]);

        // Sync pivot tables
        if (!empty($validated['people'])) {
            $project->users()->sync($validated['people']);
        }

        if (!empty($validated['tags'])) {
            $project->tags()->sync($validated['tags']);
        }

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    // ─── Edit ────────────────────────────────────────────────
    public function edit(Project $project)
    {
        $project->load(['team', 'client', 'projectLead', 'users', 'tags']);

        return Inertia::render('Projects/Edit', array_merge(
            $this->getFormData(),
            [
                'project' => array_merge($project->toArray(), [
                    'people'  => $project->users->pluck('id'),
                    'tags'    => $project->tags->pluck('id'),
                ]),
            ]
        ));
    }

    // ─── Update ──────────────────────────────────────────────
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'description'       => 'nullable|string',
            'status'            => 'required|in:active,completed,on-hold',
            'privacy'           => 'nullable|string',
            'default_task_view' => 'nullable|string',
            'team_id'           => 'nullable|exists:teams,id',
            'project_lead_id'   => 'nullable|exists:users,id',
            'start_date'        => 'nullable|date',
            'end_date'          => 'nullable|date|after_or_equal:start_date',
            'client_id'         => 'nullable|exists:clients,id',
            'budget'            => 'nullable|numeric|min:0',
            'people'            => 'nullable|array',
            'people.*'          => 'exists:users,id',
            'tags'              => 'nullable|array',
            'tags.*'            => 'exists:tags,id',
        ]);

        $project->update([
            'name'              => $validated['name'],
            'description'       => $validated['description'] ?? null,
            'status'            => $validated['status'],
            'privacy'           => $validated['privacy'] ?? null,
            'default_task_view' => $validated['default_task_view'] ?? null,
            'team_id'           => $validated['team_id'] ?? null,
            'project_lead_id'   => $validated['project_lead_id'] ?? null,
            'start_date'        => $validated['start_date'] ?? null,
            'end_date'          => $validated['end_date'] ?? null,
            'client_id'         => $validated['client_id'] ?? null,
            'budget'            => $validated['budget'] ?? null,
        ]);

        // Sync pivot tables
        $project->users()->sync($validated['people'] ?? []);
        $project->tags()->sync($validated['tags'] ?? []);

        return redirect()->route('projects.index')
            ->with('success', 'Project updated successfully.');
    }

    // ─── Destroy ─────────────────────────────────────────────
    public function destroy(Project $project)
    {
        $project->users()->detach();
        $project->tags()->detach();
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}