<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'description', 'status', 'priority', 'project_id', 'assigned_to', 'due_date'])]
class Task extends Model
{
    public function project(){
        return $this->belongsTo(Project::class);
    }

    public function assignedUser(){
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function comments(){
        return $this->hasMany(Comment::class);
    }
}
