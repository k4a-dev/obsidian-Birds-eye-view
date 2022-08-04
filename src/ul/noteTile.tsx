import React from "react";
import Note from "./note";

import type { NoteType } from "./note";

export type FileEventType = {
	dispatchOpen: (path: string, split: boolean) => void;
};

const NoteTile: React.FC<
	FileEventType & {
		notes: NoteType[];
	}
> = (p) => {
	const onClick = (e: React.MouseEvent, path: string) => {
		p.dispatchOpen(path, e.ctrlKey);
	};

	return (
		<>
			<div className="birds-eye-view_note-grid">
				{p.notes.map((note) => (
					<div
						key={note.filePath}
						className="birds-eye-view_note-container"
						onClick={(e) => onClick(e, note.filePath)}
					>
						<Note {...note}></Note>
					</div>
				))}
			</div>
		</>
	);
};

export default NoteTile;
