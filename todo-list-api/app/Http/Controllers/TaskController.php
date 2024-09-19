<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Subtask;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('due')) {
            $now = now();
            if ($request->due === 'overdue') {
                $query->where('deadline', '<', $now)->where('status', '!=', 'completed');
            } elseif ($request->due === 'upcoming') {
                $query->where('deadline', '>', $now)->where('status', '!=', 'completed');
            }
        }

        $tasks = $query->with('subtasks')->get();

        return $tasks->map(function ($task) {
            $task->progress = $task->progress;
            return $task;
        });
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'subtasks' => 'nullable|array',
        ]);

        if (isset($validatedData['deadline'])) {
            $validatedData['deadline'] = Carbon::parse($validatedData['deadline'])->setTimezone(config('app.timezone'));
        }

        $task = Task::create($validatedData);

        if (isset($validatedData['subtasks'])) {
            foreach ($validatedData['subtasks'] as $subtaskData) {
                $task->subtasks()->create([
                    'title' => $subtaskData['title'],
                    'is_completed' => $subtaskData['is_completed'] ?? false,
                ]);
            }
        }

        $task->load('subtasks');
        $task->updateStatus();
        $task->progress = $task->progress;

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        $task->load('subtasks');
        $task->progress = $task->progress;
        return $task;
    }

    public function update(Request $request, Task $task)
    {
        $validatedData = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'is_completed' => 'boolean',
            'subtasks' => 'nullable|array',
        ]);

        if (isset($validatedData['deadline'])) {
            $validatedData['deadline'] = Carbon::parse($validatedData['deadline'])->setTimezone(config('app.timezone'));
        }

        $task->update($validatedData);

        if (isset($validatedData['subtasks'])) {
            $existingSubtaskIds = $task->subtasks->pluck('id')->toArray();
            $updatedSubtaskIds = [];

            foreach ($validatedData['subtasks'] as $subtaskData) {
                if (isset($subtaskData['id'])) {
                    $subtask = Subtask::find($subtaskData['id']);
                    if ($subtask) {
                        $subtask->update([
                            'title' => $subtaskData['title'],
                            'is_completed' => $subtaskData['is_completed'] ?? false,
                        ]);
                        $updatedSubtaskIds[] = $subtask->id;
                    }
                } else {
                    $newSubtask = $task->subtasks()->create([
                        'title' => $subtaskData['title'],
                        'is_completed' => $subtaskData['is_completed'] ?? false,
                    ]);
                    $updatedSubtaskIds[] = $newSubtask->id;
                }
            }


            $subtasksToDelete = array_diff($existingSubtaskIds, $updatedSubtaskIds);
            Subtask::destroy($subtasksToDelete);
        }

        $task->load('subtasks');
        $task->updateStatus();
        $task->progress = $task->progress;

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(null, 204);
    }
}
