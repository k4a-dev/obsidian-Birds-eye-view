import dayjs from "dayjs";
import { TFile } from "obsidian";
import { IPeriodicNoteSettings } from "obsidian-daily-notes-interface";
import { getParentPath } from "./string";

export const isDailyNote = (
	file: TFile,
	dailyNoteSettings: IPeriodicNoteSettings
): boolean => {
	const day = dayjs(file.basename, dailyNoteSettings.format);

	if (!day.isValid()) return false;

	if (getParentPath(file.path) !== dailyNoteSettings.folder) return false;

	return true;
};
