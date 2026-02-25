import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class SchedulesPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // The 'value' is the incoming request body (DTO).
    // We only transform if the value is an object.
    if (!value || typeof value !== 'object') {
      return value;
    }

    // Handle event_date: "2026-01-01"
    if (value.event_date && typeof value.event_date === 'string') {
      value.event_date = new Date(value.event_date);
    }

    // Handle start_time: "18:00"
    if (value.start_time && typeof value.start_time === 'string') {
      // For timetz, combine with a fixed date.
      // Appending ':00' to handle "HH:mm" format reliably.
      value.start_time = new Date(`1970-01-01T${value.start_time}:00`);
    }

    // Handle end_time: "06:00"
    if (value.end_time && typeof value.end_time === 'string') {
      // For timetz, combine with a fixed date.
      value.end_time = new Date(`1970-01-01T${value.end_time}:00`);
    }

    return value;
  }
}