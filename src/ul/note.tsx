import React, { useEffect, useState } from "react";

export type NoteType = {
	title: string;
	content: string;
	getContent: () => Promise<string>;
	createtime: number;
	updatetime: number;
	filePath: string;
	sumbNailPath?: string;
};

const renderEditor = (content: string) => {
	return content
		? content.split(/\n/).map((line, i) => <p key={i}>{line}</p>)
		: "Loading...";
};

const renderExternalSumbNail = (title: string, content: string) => {
	const lines = content.split("\n");
	for (let lineNum = 0; lineNum < Math.min(100, lines.length); lineNum++) {
		const line = lines[lineNum];
		const match = line.match(/^!\[.*\]\((.+)\)/);
		if (match && match[1]) {
			return <img src={match[1]} alt={title} />;
		}
	}

	return <></>;
};

const renderSumbNail = (
	sumbNailPath: string | undefined,
	title: string,
	content: string
) => {
	if (sumbNailPath == null) return renderExternalSumbNail(title, content);
	return <img src={sumbNailPath} alt={title} />;
};

import { useInView } from "react-intersection-observer";

const NoteContent: React.FC<NoteType> = (p) => {
	const [content, setContent] = useState("");

	useEffect(() => {
		p.getContent().then((content) => setContent(content));
	}, []);

	return (
		<>
			{content !== ""
				? renderSumbNail(p.sumbNailPath, p.title, content)
				: null}
			<div className="birds-eye-view_note-band"></div>
			<div className="birds-eye-view_note">
				<p className="birds-eye-view_note-title">{p.title}</p>
				<div>{renderEditor(content)}</div>
			</div>
		</>
	);
};

const Note: React.FC<NoteType> = (p) => {
	const { ref, inView, entry } = useInView({
		threshold: 0,
	});

	return (
		<>
			<div ref={ref}></div>
			{inView && <NoteContent {...p} />}
		</>
	);
};

export default Note;
