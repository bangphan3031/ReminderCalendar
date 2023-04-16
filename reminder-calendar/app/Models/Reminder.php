<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reminder extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'reminders';

    protected $fillable = [
        'event_id',
        'method',
        'time',
        'kind_of_time',
    ];

    public function event(){
        return $this->belongsTo(Event::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'deleted_at',
    ];
}
