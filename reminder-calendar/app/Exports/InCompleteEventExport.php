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
            'Is All Day',
            'Start Time',
            'End Time',
            'Organizer',
            'Created date',
        ];
    }

    public function map($event): array
    {
        return [
            $event->creator_calendar ? $event->creator_calendar : $event->name,
            $event->title,
            $event->is_all_day,
            $event->start_time,
            $event->end_time,
            $event->creator ? $event->creator : 'Me',
            $event->created_at,
        ];
    }
}
