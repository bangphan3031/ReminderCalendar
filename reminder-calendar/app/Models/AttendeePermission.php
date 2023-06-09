<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AttendeePermission extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'attendee_permissions';

    protected $fillable = [
        'attendee_id',
        'permission',
    ];

    public function attendee(){
        return $this->belongsTo(Attendee::class);
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
