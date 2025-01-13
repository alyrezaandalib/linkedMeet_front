export default function truncateMessage(message: string, maxLength: number = 20): string {
    if (message.length > maxLength) {
        return message.slice(0, maxLength) + "...";
    }
    return message;
}
