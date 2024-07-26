export type GoogleCalendarEvent = {
	title: string;
	start: {
		dateTime: string;
		timeZone: string;
	};
	end: {
		dateTime: string;
		timeZone: string;
	};
	color?: number;
	description?: string;
	location?: string;
};
