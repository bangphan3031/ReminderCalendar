<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Calendar extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'calendars';

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'color',
    ];

    public function uesr(){
        return $this->belongsTo(User::class);
    }

    public function event(){
        return $this->hasMany(Event::class);
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
