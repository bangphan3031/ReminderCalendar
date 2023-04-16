<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventReminderNotification extends Notification
{
    use Queueable;
    
    protected $event;

    /**
     * Create a new notification instance.
     */
    public function __construct($event)
    {
        //
        $this->event = $event;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('Reminder: ' . $this->event->title)
                    ->line('Start Time: ' . $this->event->start_time)
                    ->action('View Event', url('/events/' . $this->event->id));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
            'event_id' => $this->event->id,
            'message' => 'Reminder: ' . $this->event->title,
            'start_time' => $this->event->start_time,
        ];
    }
    
    public function handle()
    {
        $reminderTime = strtotime($this->event->start_time) - $this->event->reminder->time;
        $reminderTime = date('Y-m-d H:i:s', $reminderTime);

        $users = [$this->event->user_id];
        foreach ($this->event->attendees as $attendee) {
            $users[] = $attendee->user_id;
        }
        $users = array_unique($users);

        foreach ($users as $user_id) {
            $notifiable = User::find($user_id);
            if ($notifiable) {
                $notifiable->notify((new EventReminderNotification($this->event))->delay($reminderTime));
            }
        }
    }
}
