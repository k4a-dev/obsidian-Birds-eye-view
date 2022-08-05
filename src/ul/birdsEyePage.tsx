import React from "react";
import NoteTile, { FileEventType } from "./noteTile";

import Select from "react-select";

import type { NoteType } from "./note";
const BirdsEyePage: React.FC<{ notes: NoteType[] } & FileEventType> = (p) => {
	const options = [
		{ value: "a", label: "updateDate" },
		{ value: "b", label: "createDate" },
	];

	return (
		<>
			<div className="birds-eye-view_control-container">
				<Select
					options={options}
					onChange={(newValue) => {
						console.log(newValue);
					}}
				></Select>
				<p>number of notes : {p.notes.length}</p>
			</div>
			<div className="birds-eye-view_notes-container">
				<NoteTile notes={p.notes} dispatchOpen={p.dispatchOpen} />
			</div>
		</>
	);
};

export default BirdsEyePage;
