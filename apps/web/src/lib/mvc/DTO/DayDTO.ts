import type { RelationExpandDTO } from '$lib/mvc/DTO/RelationExpandDTO';

export type DayDTO = {
	expand?: RelationExpandDTO;
	id: string;
	name: string;
};

export type RequestDayDTO = {
	name: string;
};
