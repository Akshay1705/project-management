<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskController extends Controller
{
    // ─── Index ───────────────────────────────────────────────
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $tasks = Task::with(['project', 'assignedUser', 'subtasks'])
            ->when(!$user->hasRole('admin'), function ($query) use ($user) {
                $query->where('assigned_to', $user->id);
            })
            ->latest()
            ->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
        ]);
    }

    // ─── Create ──────────────────────────────────────────────
    public function create()
    {
        $projects = Project::with('users')->select('id', 'name')->get();

        return Inertia::render('Tasks/Create', [
            'projects' => $projects,
        ]);
    }

    // ─── Store ───────────────────────────────────────────────
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,draft,on process,in_progress,completed,on-hold,urgent,close',
            'priority' => 'required|in:low,medium,high,urgent',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date|after_or_equal:today',
        ]);

        Task::create($validated);

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task created successfully.');
    }

    // ─── Edit ────────────────────────────────────────────────
    public function edit(Task $task)
    {
        $projects = Project::with('users')->select('id', 'name')->get();

        return Inertia::render('Tasks/Edit', [
            'task'     => $task->load('assignedUser', 'project'),
            'projects' => $projects,
        ]);
    }

    // ─── Update ──────────────────────────────────────────────
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date|after_or_equal:today',
            'status' => 'required|in:todo,draft,on process,in_progress,completed,on-hold,urgent,close',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $task->update($validated);

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task updated successfully.');
    }

    // ─── Destroy ─────────────────────────────────────────────
    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }
}