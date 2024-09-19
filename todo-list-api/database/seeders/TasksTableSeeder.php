<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\Subtask;
use Carbon\Carbon;

class TasksTableSeeder extends Seeder
{
    public function run()
    {
        $tasks = [
            [
                'title' => 'Design new UI presentation',
                'description' => 'Create a stunning UI presentation for the new project',
                'deadline' => Carbon::now()->addDays(5),
                'is_completed' => false,
            ],
            [
                'title' => 'Develop backend API',
                'description' => 'Implement RESTful API for the new features',
                'deadline' => Carbon::now()->addDays(10),
                'is_completed' => false,
            ],
            [
                'title' => 'Write unit tests',
                'description' => 'Create comprehensive unit tests for all new functions',
                'deadline' => Carbon::now()->addDays(7),
                'is_completed' => false,
            ],
            [
                'title' => 'Prepare project documentation',
                'description' => 'Document all features, APIs, and setup instructions',
                'deadline' => Carbon::now()->addDays(12),
                'is_completed' => false,
            ],
            [
                'title' => 'Review pull requests',
                'description' => 'Review and merge pending pull requests',
                'deadline' => Carbon::now()->addDays(3),
                'is_completed' => true,
            ],
            [
                'title' => 'Optimize database queries',
                'description' => 'Improve performance of slow database queries',
                'deadline' => Carbon::now()->addDays(8),
                'is_completed' => false,
            ],
            [
                'title' => 'Implement user authentication',
                'description' => 'Add secure user authentication system',
                'deadline' => Carbon::now()->addDays(6),
                'is_completed' => true,
            ],
            [
                'title' => 'Create mobile responsive design',
                'description' => 'Ensure the website is fully responsive on all devices',
                'deadline' => Carbon::now()->addDays(9),
                'is_completed' => false,
            ],
            [
                'title' => 'Conduct security audit',
                'description' => 'Perform a thorough security check of the entire system',
                'deadline' => Carbon::now()->addDays(15),
                'is_completed' => false,
            ],
            [
                'title' => 'Implement payment gateway',
                'description' => 'Integrate a secure payment system for transactions',
                'deadline' => Carbon::now()->addDays(11),
                'is_completed' => false,
            ],
            [
                'title' => 'Optimize front-end performance',
                'description' => 'Improve load times and overall performance of the front-end',
                'deadline' => Carbon::now()->addDays(7),
                'is_completed' => false,
            ],
            [
                'title' => 'Set up continuous integration',
                'description' => 'Implement CI/CD pipeline for automated testing and deployment',
                'deadline' => Carbon::now()->addDays(13),
                'is_completed' => true,
            ],
            [
                'title' => 'Create user onboarding flow',
                'description' => 'Design and implement an intuitive onboarding process for new users',
                'deadline' => Carbon::now()->addDays(8),
                'is_completed' => false,
            ],
            [
                'title' => 'Implement data analytics',
                'description' => 'Set up analytics to track key user interactions and metrics',
                'deadline' => Carbon::now()->addDays(10),
                'is_completed' => false,
            ],
            [
                'title' => 'Conduct user testing',
                'description' => 'Organize and conduct user testing sessions for feedback',
                'deadline' => Carbon::now()->addDays(14),
                'is_completed' => false,
            ],
        ];

        foreach ($tasks as $taskData) {
            $task = Task::create($taskData);

            // Create 2-4 subtasks for each task
            $subtaskCount = rand(2, 4);
            for ($i = 1; $i <= $subtaskCount; $i++) {
                Subtask::create([
                    'task_id' => $task->id,
                    'title' => "Subtask $i for " . $task->title,
                    'is_completed' => (bool)rand(0, 1),
                ]);
            }
        }
    }
}
