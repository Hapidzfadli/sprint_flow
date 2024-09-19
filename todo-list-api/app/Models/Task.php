<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'description', 'deadline', 'is_completed'];
    protected $appends = ['progress'];
    protected $casts = [
        'deadline' => 'datetime',
    ];

    public function subtasks()
    {
        return $this->hasMany(Subtask::class);
    }

    public function getProgressAttribute()
    {
        $totalSubtasks = $this->subtasks()->count();
        if ($totalSubtasks === 0) {
            return $this->is_completed ? 100 : 0;
        }
        $completedSubtasks = $this->subtasks()->where('is_completed', true)->count();
        return ($completedSubtasks / $totalSubtasks) * 100;
    }
}
