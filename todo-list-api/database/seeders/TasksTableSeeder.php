<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\Subtask;
use Carbon\Carbon;
use Faker\Factory as Faker;

class TasksTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        $statuses = ['todo', 'in_progress', 'completed'];

        for ($i = 0; $i < 20; $i++) {
            $status = $faker->randomElement($statuses);
            $deadlinedays = $faker->numberBetween(-30, 30);

            $task = Task::create([
                'title' => $faker->sentence(3),
                'description' => $faker->paragraph,
                'deadline' => Carbon::now()->addDays($deadlinedays),
                'status' => $status,
                'is_completed' => $status === 'completed',
            ]);

            // Create 2-5 subtasks for each task
            $subtaskCount = $faker->numberBetween(2, 5);
            for ($j = 0; $j < $subtaskCount; $j++) {
                $isCompleted = $status === 'completed' ? true : ($status === 'in_progress' ? $faker->boolean : false);

                Subtask::create([
                    'task_id' => $task->id,
                    'title' => $faker->sentence(4),
                    'is_completed' => $isCompleted,
                ]);
            }

            // Update task status based on subtasks
            $task->updateStatus();
        }
    }
}
