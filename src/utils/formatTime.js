import {format, getTime, formatDistanceToNow } from "date-fns"

export function fDate(date) {
    return format(new Date(date), "dd MMM yyy");
}

export function fDateTime(date) {
    return format(new Date(date));
}

export function fTimesstamp(date) {
    return getTime(new Date(date), "dd MMM yyy HH:mm");
}

export function fDateTimeSuffix(date) {
    return format(new Date(date), "dd MMM yyy HH:mm p");
}

export function fToNow(date) {
    return formatDistanceToNow(new Date(date),{
        addSuffix: true,
    });
}