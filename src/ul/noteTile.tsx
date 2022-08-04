import React from "react";
import Note from "./note";

import type { NoteType } from "./note";
const NoteTile: React.FC<{ notes: NoteType[] }> = (p) => {
	return (
		<>
			{p.notes.map((note) => (
				<Note {...note}></Note>
			))}
		</>
	);
};

export default NoteTile;
