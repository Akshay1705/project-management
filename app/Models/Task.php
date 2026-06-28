<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

class Task extends Model
{
    protected $fillable = ['title', 'description', 'status', 'priority', 'project_id', 'assigned_to', 'due_date'];
    
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
