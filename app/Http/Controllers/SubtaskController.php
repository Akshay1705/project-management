<?php

namespace App\Http\Controllers;

use App\Models\Subtask;
use App\Models\Task;
use Illuminate\Http\Request;

class SubtaskController extends Controller
{
    public function store(Request $request, Task $task)
    {
        $request->validate(['title' => 'required|string|max:255']);

        $task->subtasks()->create([
            'title'   => $request->title,
            'is_done' => false,
        ]);

        return back()->with('success', 'Subtask created.');
    }

    public function update(Request $request, Task $task, Subtask $subtask)
    {
        $request->validate([
            'title'   => 'sometimes|string|max:255',
            'is_done' => 'sometimes|boolean',
        ]);

        $subtask->update($request->only('title', 'is_done'));

        return back()->with('success', 'Subtask updated.');
    }

    public function destroy(Task $task, Subtask $subtask)
    {
        $subtask->delete();
        return back()->with('success', 'Subtask deleted.');
    }
}