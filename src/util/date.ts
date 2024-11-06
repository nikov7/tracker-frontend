export function getDateString(localDate: Date) {
    const year = localDate.getFullYear();
    const month = localDate.getMonth() + 1; // getMonth() returns 0-11
    const day = localDate.getDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}