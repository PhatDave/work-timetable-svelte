import type {IconDefinition} from '@fortawesome/fontawesome-svg-core';

export const themes = ['dark', 'light'] as const;
export type Theme = (typeof themes)[number];

export type NavLink = {
    target: {
        href: string;
        newTab?: boolean;
    };
    content: {
        text?: string;
        icon?: IconDefinition;
    };
};

export type api_day_dto = {
    id: string,
    name: string,
    expand: {
        "overtime(day)": api_overtime_dto[],
        "work_time(day)": api_work_time_dto[],
    }
}
export type api_overtime_dto = {
    id: string,
    hours: number,
    day: string,
    description: string,
}
export type api_work_time_dto = {
    id: string,
    hours: number,
    day: string,
}


export type api_day = {
    id: string,
    name: Date,
    overtime: api_overtime[],
    work_time: api_work_time[],
}
export type api_overtime = {
    id: string,
    hours: number,
    description: string,
}
export type api_work_time = {
    id: string,
    hours: number,
}
