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

import { unified } from "unified";

import remark from "remark-parse";

import { useInView } from "react-intersection-observer";
import { Root } from "remark-parse/lib";
import { Content } from "mdast";

const RenderLine: React.FC<{ content: string }> = ({ content }) => {
	let match = null;

	const replaced = content.replace(/\!\[.*\]\(.*\)/g, "");

	if ((match = replaced.match(/#+ (.*)/))) {
		return <p>{match[1]}</p>;
	}

	return <p>{replaced}</p>;
};

const renderContent = (content: string) => {
	const proceseer = unified().use(remark);
	const root = proceseer.parse(content);

	return content
		? content
				.split(/\n/)
				.slice(0, 20)
				.map((line, i) => <RenderLine key={i} content={line} />)
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
				<div>{renderContent(content)}</div>
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
