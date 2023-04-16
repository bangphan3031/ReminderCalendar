<?php

namespace App\Jobs;

use App\Mail\ReminderMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $email;
    protected $title;
    protected $start_time;
    protected $end_time;
    protected $location;
    protected $description;
    protected $create_user;

    /**
     * Create a new job instance.
     */
    public function __construct($email, $title, $start_time, $end_time, $location, $description, $create_user)
    {
        //
        $this->email = $email;
        $this->title = $title;
        $this->start_time = $start_time;
        $this->end_time = $end_time;
        $this->location = $location;
        $this->description = $description;
        $this->create_user = $create_user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        $data = [
            'title' => $this->title,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'location' => $this->location,
            'description' => $this->description,
            'create_user' => $this->create_user,
        ];
        Mail::send('emails.reminder', $data, function($message) {
            $message->to($this->email)
                ->subject($this->title);
        });
    }
}
