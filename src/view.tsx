import { ItemView, WorkspaceLeaf } from "obsidian";

import React from "react";
import ReactDOM from "react-dom";
import BirdsEyePage from "./ul/birdsEyePage";
export const BIRDS_EYE_VIEW_TYPE = "birds-eye-view";
import { createRoot } from "react-dom/client";

import { NoteType } from "./ul/note";

export class BirdsEyeView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return BIRDS_EYE_VIEW_TYPE;
	}

	getDisplayText() {
		return "Example view?";
	}

	async onOpen() {
		const root = createRoot(this.containerEl.children[1]);
		const notes: NoteType[] = [
			{
				title: "Note1",
				content:
					" Adds a plugin setting tab to the settings page.- Registers a global click event and output 'click' to the console.- Registers a global interval which logs 'setInterval' to the console.",
				filePath: "1",
			},
			{
				title: "Note1",
				content:
					" Adds a plugin setting tab to the settings page.- Registers a global click event and output 'click' to the console.- Registers a global interval which logs 'setInterval' to the console.",
				filePath: "2",
			},
		];

		const dispatchOpen = (filePath: string, split: boolean) => {
			console.log(filePath);
		};

		root.render(
			<React.StrictMode>
				<BirdsEyePage notes={notes} dispatchOpen={dispatchOpen} />,
			</React.StrictMode>
		);
	}

	async onClose() {
		ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
	}
}
