import {format, formatDistanceToNow} from 'date-fns';
import { TZDate } from "@date-fns/tz";

export function formatDateToClientTimezone (utcDateString: string, humanReadable: boolean = false): string {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = new TZDate(utcDateString, timeZone);

    if (!humanReadable) {
        return format(zonedDate, "yyyy-MM-dd HH:mm");
    }

    return formatDistanceToNow(zonedDate, { addSuffix: true });
}
