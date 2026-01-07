export const formatDate = (date: string): string => {

    if (typeof date !== 'string') {
        return '';
    }

    const inputDate = new Date(date);

    if (isNaN(inputDate.getTime())) {
        return '';
    }

    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const year = inputDate.getFullYear().toString();
    const hours = inputDate.getHours().toString().padStart(2, '0');
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
};