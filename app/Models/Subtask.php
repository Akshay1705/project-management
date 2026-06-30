<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subtask extends Model
{
    protected $fillable = ['title', 'is_done', 'task_id'];

    protected $casts = [
        'is_done' => 'boolean',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}