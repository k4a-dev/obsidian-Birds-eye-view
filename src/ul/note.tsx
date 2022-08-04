import React from "react";

export type NoteType = {
	title: string;
	content: string;
	sumbNailPath?: string;
};

const Note: React.FC<{} & NoteType> = (p) => {
	return (
		<>
			<p>{p.title}</p>
			<p>{p.content}</p>
			<img src={`${p.sumbNailPath}`} alt={p.title} />
		</>
	);
};

export default Note;
