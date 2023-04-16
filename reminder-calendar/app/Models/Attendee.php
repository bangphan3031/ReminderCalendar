<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attendee extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'attendees';

    protected $fillable = [
        'event_id',
        'user_id',
    ];

    public function event(){
        return $this->belongsTo(Event::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function attendeePermission(){
        return $this->hasMany(AttendeePermission::class);
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
