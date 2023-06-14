<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class InCompleteEventExport implements FromCollection, WithHeadings, WithMapping
{
    protected $events;

    public function __construct($events)
    {
        $this->events = $events;
    }

    public function collection()
    {
        return $this->events;
    }

    public function headings(): array
    {
        return [
            'Calendar',
            'Title',
            'Date',
            'Time',
            'Organizer',
            'Created date',
        ];
    }

    public function map($event): array
    {
        $start_time = $event->start_time; 
        $end_time = $event->end_time; 
        $is_all_day = $event->is_all_day; 

        $start_date = date('d-m-Y', strtotime($start_time));
        $end_date = date('d-m-Y', strtotime($end_time));

        if ($start_date == $end_date) {
            $date = $start_date;
        } else {
            $date = $start_date . ' - ' . $end_date;
        }

        if ($is_all_day == 1) {
            $time = 'all day';
        } elseif ($start_time != $end_time) {
            $start_time_formatted = date('h:i a', strtotime($start_time));
            $end_time_formatted = date('h:i a', strtotime($end_time));
            $time = $start_time_formatted . ' - ' . $end_time_formatted;
        } else {
            $time = date('h:i a', strtotime($start_time));
        }

        return [
            $event->creator_calendar ? $event->creator_calendar : $event->name,
            $event->title,
            $date,
            $time,
            $event->creator ? $event->creator : 'Me',
            $event->updated_at,
        ];
    }
}
