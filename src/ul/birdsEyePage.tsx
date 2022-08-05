import React, { useState } from "react";
import NoteTile, { FileEventType } from "./noteTile";

import Select, { StylesConfig } from "react-select";

import type { NoteType } from "./note";

const customStyles: StylesConfig = {
	option: (provided, state) => ({
		...provided,
		color: state.isSelected ? "var(--text-accent)" : "var(--text-normal)",
		background: state.isFocused
			? "var(--background-secondary)"
			: "var(--background-primary)",
	}),
	control: (provided, state) => ({
		...provided,
		background: "var(--background-primary)",
	}),

	container: (provided, state) => ({ ...provided, width: "100%" }),

	menuList: (provided, state) => ({
		...provided,
		background: "var(--background-primary)",
		border: "1px solid var(--text-muted)",
	}),

	menu: (provided, state) => ({
		...provided,
		background: "var(--background-primary)",
	}),

	singleValue: (provided, state) => {
		const opacity = state.isDisabled ? 0.5 : 1;
		const transition = "opacity 300ms";
		return {
			...provided,
			opacity,
			transition,
			color: "var(--text-normal)",
		};
	},
};
export type SortCondType = "title" | "createtime" | "updatetime";

type SortOption = {
	value: SortCondType;
	label: SortCondType;
	top: string;
	bottom: string;
	sortOrder: -1 | 1;
};

const options: SortOption[] = [
	{ value: "title", label: "title", top: "a", bottom: "z", sortOrder: 1 },
	{
		value: "createtime",
		label: "createtime",
		top: "new",
		bottom: "old",
		sortOrder: -1,
	},
	{
		value: "updatetime",
		label: "updatetime",
		top: "new",
		bottom: "old",
		sortOrder: -1,
	},
];

const asortFunc = (
	a: NoteType,
	b: NoteType,
	cond: SortCondType,
	sortOrder: -1 | 1
) => {
	if (!(cond in a) || !(cond in b)) return 0;
	return a[cond] < b[cond] ? sortOrder : -1 * sortOrder;
};

const BirdsEyePage: React.FC<
	{ notes: NoteType[]; defaultSortCond: SortCondType } & FileEventType
> = (p) => {
	const [sortValue, setSortValue] = useState<SortOption>(() => {
		const f = options.find((o) => o.value == p.defaultSortCond);
		return f ? f : options[0];
	});

	const [sortOrder, setSortOrder] = useState<-1 | 1>(-1);

	const [sortFunc, setSortFunc] = useState<
		(a: NoteType, b: NoteType, sortOrder: -1 | 1) => number
	>(() => (a: NoteType, b: NoteType, sortOrder: -1 | 1) => {
		return asortFunc(
			a,
			b,
			sortValue.value,
			sortOrder * sortValue.sortOrder == 1 ? 1 : -1
		);
	});

	const onSortChange = (newValue: SortOption) => {
		if (!newValue.value) return;
		setSortFunc(() => (a: NoteType, b: NoteType, sortOrder: -1 | 1) => {
			return asortFunc(
				a,
				b,
				newValue.value,
				sortOrder * newValue.sortOrder == 1 ? 1 : -1
			);
		});
		setSortValue(newValue);
	};

	return (
		<>
			<div className="birds-eye-view_control-container">
				<Select
					styles={customStyles}
					options={options}
					value={sortValue}
					defaultValue={{
						label: p.defaultSortCond,
						value: p.defaultSortCond,
					}}
					placeholder="Sort by"
					onChange={onSortChange}
				></Select>
				<button
					value={sortOrder}
					onClick={(e) => {
						setSortOrder(sortOrder == 1 ? -1 : 1);
					}}
				>
					{sortValue?.top}
					{sortOrder == -1 ? ` -> ` : " <- "}
					{sortValue?.bottom}
				</button>
			</div>
			<div className="birds-eye-view_notes-container">
				<p>number of notes : {p.notes.length}</p>
				<NoteTile
					notes={p.notes.sort((a, b) => sortFunc(a, b, sortOrder))}
					dispatchOpen={p.dispatchOpen}
				/>
			</div>
		</>
	);
};

export default BirdsEyePage;
