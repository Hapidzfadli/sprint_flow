<?php

namespace App\Http\Controllers;

use App\Models\Subtask;
use App\Models\Task;
use Illuminate\Http\Request;

class SubtaskController extends Controller
{
    public function index(Task $task)
    {
        return $task->subtasks;
    }

    public function store(Request $request, Task $task)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $subtask = $task->subtasks()->create($validatedData);
        return response()->json($subtask, 201);
    }

    public function show(Subtask $subtask)
    {
        return $subtask;
    }

    public function update(Request $request, Subtask $subtask)
    {
        $validatedData = $request->validate([
            'title' => 'string|max:255',
            'is_completed' => 'boolean',
        ]);

        $subtask->update($validatedData);
        return response()->json($subtask);
    }

    public function destroy(Subtask $subtask)
    {
        $subtask->delete();
        return response()->json(null, 204);
    }
}
