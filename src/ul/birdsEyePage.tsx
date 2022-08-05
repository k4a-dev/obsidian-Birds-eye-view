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

const BirdsEyePage: React.FC<{ notes: NoteType[] } & FileEventType> = (p) => {
	const [sortFunc, setSortFunc] =
		useState<(a: NoteType, b: NoteType) => number>();

	const options = [
		{ value: "title", label: "title" },
		{ value: "createtime", label: "createtime" },
		{ value: "updatetime", label: "updatetime" },
	];

	const onSortChange = (newValue: { value: string; label: string }) => {
		if (!newValue.value) return;

		setSortFunc(() => (a: NoteType, b: NoteType) => {
			const cond = newValue.value;
			if (!(cond in a) || !(cond in b)) return 0;
			// @ts-ignore
			return a[cond] < b[cond] ? -1 : 1;
		});
	};

	return (
		<>
			<div className="birds-eye-view_control-container">
				<Select
					styles={customStyles}
					options={options}
					placeholder="Sort by"
					onChange={onSortChange}
				></Select>
				<p>number of notes : {p.notes.length}</p>
			</div>
			<div className="birds-eye-view_notes-container">
				<NoteTile
					notes={p.notes.sort(sortFunc)}
					dispatchOpen={p.dispatchOpen}
				/>
			</div>
		</>
	);
};

export default BirdsEyePage;
