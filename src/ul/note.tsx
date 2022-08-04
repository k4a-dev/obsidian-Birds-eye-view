import React from "react";

export type NoteType = {
	title: string;
	content: string;
	filePath: string;
	sumbNailPath?: string;
};

const renderEditor = (content: string) => {
	return content.split(/\n/).map((line, i) => <p key={i}>{line}</p>);
};

const Note: React.FC<NoteType> = (p) => {
	return (
		<>
			<p>{p.title}</p>
			<div>{renderEditor(p.content)}</div>
			<img src={`${p.sumbNailPath}`} alt={p.title} />
		</>
	);
};

export default Note;
