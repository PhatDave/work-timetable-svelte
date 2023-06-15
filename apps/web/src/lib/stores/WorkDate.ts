import {writable} from 'svelte/store';

const create_store = () => {
    const {subscribe, set, update} = writable<Date>(new Date());
    return {
        subscribe,
        set,
        update,
        forward() {
            update((date) => {
                date.setMonth(date.getMonth() + 1);
                return date;
            });
        },
        backward() {
            update((date) => {
                date.setMonth(date.getMonth() - 1);
                return date;
            });
        }
    };
};

export const work_date = create_store();
