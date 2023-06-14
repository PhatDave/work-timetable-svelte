import type {OvertimeDTO} from '$lib/mvc/DTO/OvertimeDTO';
import type {WorktimeDTO} from '$lib/mvc/DTO/WorktimeDTO';

export type RelationExpandDTO = {
    'overtime(day)'?: OvertimeDTO[];
    'work_time(day)'?: WorktimeDTO[];
};
