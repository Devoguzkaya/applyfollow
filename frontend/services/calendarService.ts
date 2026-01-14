import api from './api';

export interface CalendarEvent {
    id: string;
    date: string; // YYYY-MM-DD
    title: string;
    time: string; // HH:mm:ss OR HH:mm
    type: 'event' | 'interview' | 'deadline';
    notes?: string;
    hasAlarm: boolean;
    alarmTime?: string; // HH:mm or HH:mm:ss
}

export type CreateCalendarEventRequest = Omit<CalendarEvent, 'id'>;

export const calendarService = {
    getAllEvents: async (): Promise<CalendarEvent[]> => {
        const response = await api.get<CalendarEvent[]>('/calendar');
        return response.data;
    },

    createEvent: async (event: CreateCalendarEventRequest): Promise<CalendarEvent> => {
        const response = await api.post<CalendarEvent>('/calendar', event);
        return response.data;
    },

    deleteEvent: async (id: string): Promise<void> => {
        await api.delete(`/calendar/${id}`);
    }
};
