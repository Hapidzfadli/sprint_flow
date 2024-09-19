<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::query();

        if ($request->has('status')) {
            $status = $request->status === 'completed';
            $query->where('is_completed', $status);
        }

        if ($request->has('due')) {
            $now = now();
            if ($request->due === 'overdue') {
                $query->where('deadline', '<', $now)->where('is_completed', false);
            } elseif ($request->due === 'upcoming') {
                $query->where('deadline', '>', $now)->where('is_completed', false);
            }
        }

        return $query->with('subtasks')->get();
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date_format:Y-m-d\TH:i:s\Z',
        ]);

        if (isset($validatedData['deadline'])) {
            $validatedData['deadline'] = Carbon::parse($validatedData['deadline'])->setTimezone(config('app.timezone'));
        }

        $task = Task::create($validatedData);
        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        return $task->load('subtasks');
    }

    public function update(Request $request, Task $task)
    {
        $validatedData = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date_format:Y-m-d\TH:i:s\Z',
            'is_completed' => 'boolean',
        ]);

        if (isset($validatedData['deadline'])) {
            $validatedData['deadline'] = Carbon::parse($validatedData['deadline'])->setTimezone(config('app.timezone'));
        }

        $task->update($validatedData);

        if ($task->subtasks()->count() > 0 && $task->subtasks()->where('is_completed', false)->count() === 0) {
            $task->update(['is_completed' => true]);
        }

        return response()->json($task->load('subtasks'));
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(null, 204);
    }
}
