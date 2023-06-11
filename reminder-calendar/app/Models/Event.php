<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'events';

    protected $fillable = [
        'calendar_id',
        'event_id',
        'title',
        'is_all_day',
        'start_time',
        'end_time',
        'location',
        'description',
        'status',
    ];

    public function calendar(){
        return $this->belongsTo(Calendar::class);
    }

    public function reminder(){
        return $this->hasMany(Reminder::class);
    }

    public function attendee(){
        return $this->hasMany(Attendee::class);
    }
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */

}
