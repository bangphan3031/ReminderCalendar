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
    public $start_time;
    public $end_time;
    public $location;
    public $description;
    public $create_user;
    /**
     * Create a new message instance.
     */
    public function __construct($title, $start_time, $end_time, $location, $description, $create_user)
    {
        //
        $this->title = $title;
        $this->start_time = $start_time;
        $this->end_time = $end_time;
        $this->location = $location;
        $this->description = $description;
        $this->create_user = $create_user;
    }

    public function build()
    {
        // return $this->view('emails.reminder')
        //             ->subject($this->title)
        //             ->with([
        //                 'title' => $this->title,
        //                 'start_time' => $this->start_time,
        //                 'end_time' => $this->end_time,
        //                 'location' => $this->location,
        //                 'description' => $this->description,
        //                 'create_user' => $this->create_user,
        //             ]);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reminder Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.reminder',
        );
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
