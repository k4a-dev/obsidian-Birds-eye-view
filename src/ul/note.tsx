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
	return content.split(/\n/).map((line, i) => <p key={i}>{line}</p>);
};

const buildPath = (path: string): string => {
	return path;
};

const renderSumbNail = (sumbNailPath: string | undefined, title: string) => {
	if (sumbNailPath == null) return <></>;
	return <img src={buildPath(sumbNailPath)} alt={title} />;
};

import { useInView } from "react-intersection-observer";

const NoteContent: React.FC<NoteType> = (p) => {
	const [content, setContent] = useState("Loading...");

	useEffect(() => {
		p.getContent().then((content) => setContent(content));
	});

	return (
		<>
			<>
				{renderSumbNail(p.sumbNailPath, p.title)}
				<div className="birds-eye-view_note">
					<p className="birds-eye-view_note-title">{p.title}</p>
					<div>{renderEditor(content)}</div>
				</div>
			</>
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
			{inView && (
				<>
					<NoteContent {...p} />
				</>
			)}
		</>
	);
};

export default Note;
