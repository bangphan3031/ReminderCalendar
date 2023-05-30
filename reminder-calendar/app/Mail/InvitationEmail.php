<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvitationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $title;
    public $time;
    public $location;
    public $description;
    public $create_user;

    public function __construct($title, $time, $location, $description, $create_user)
    {
        $this->title = $title;
        $this->time = $time;
        $this->location = $location;
        $this->description = $description;
        $this->create_user = $create_user;
    }

    public function build()
    {
        return $this->view('emails.invitation')
            ->subject('Assigning tasks mail');
    }
}