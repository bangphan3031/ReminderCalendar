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
use Exception;
use Twilio\Rest\Client;

class SendReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $recipient;
    protected $title;
    protected $time;
    protected $location;
    protected $description;
    protected $create_user;
    protected $reminder_id;
    protected $method;

    /**
     * Create a new job instance.
     */
    public function __construct($recipient, $title, $time, $location, $description, $create_user, $reminder_id, $method)
    {
        //
        $this->recipient = $recipient;
        $this->title = $title;
        $this->time = $time;
        $this->location = $location;
        $this->description = $description;
        $this->create_user = $create_user;
        $this->reminder_id = $reminder_id;
        $this->method = $method;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        if ($this->method === 'Email') {
            // Gửi mail
            $data = [
                'title' => $this->title,
                'time' => $this->time,
                'location' => $this->location,
                'description' => $this->description,
                'create_user' => $this->create_user,
                'id' => $this->reminder_id,
            ];
            Mail::send('emails.reminder', $data, function($message) {
                $message->to($this->recipient)
                    ->subject($this->title);
            });
        } elseif ($this->method === 'Sms') {
            if (substr($this->recipient, 0, 1) === "0") {
                $receiverNumber = "+84" . substr($this->recipient, 1);
            }
            //$receiverNumber = "+84364911017";
            $message = "Nhắc nhở công việc\n" .
                    "Tiêu đề công việc: $this->title\n" .
                    "Thời gian: $this->time\n" .
                    "\n" .
                    "Địa điểm: $this->location\n" .
                    "\n" .
                    "Mô tả công việc: $this->description";
                    // Nội dung tin nhắn SMS
            try {
                $account_sid = config('services.twilio.sid');
                $auth_token = config('services.twilio.auth_token');
                $twilio_number = config('services.twilio.phone_number');
    
                $client = new Client($account_sid, $auth_token);
                $client->messages->create($receiverNumber, [
                    'from' => $twilio_number, 
                    'body' => $message
                ]);
            } catch (Exception $e) {
                dd("Error: ". $e->getMessage());
            }
        }
    }
}
