<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $title;
    public $time;
    public $location;
    public $description;
    public $create_user;
    /**
     * Create a new message instance.
     */
    public function __construct($title, $time, $location, $description, $create_user)
    {
        //
        $this->title = $title;
        $this->time= $time;
        $this->location = $location;
        $this->description = $description;
        $this->create_user = $create_user;
    }

    public function build()
    {
        return $this->view('emails.reminder')
        ->subject('Reminder Mail');
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
