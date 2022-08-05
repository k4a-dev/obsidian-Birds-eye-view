import { ItemView, TFile, WorkspaceLeaf } from "obsidian";

import React from "react";
import ReactDOM from "react-dom";
import BirdsEyePage, { SortCondType } from "./ul/birdsEyePage";
export const BIRDS_EYE_VIEW_TYPE = "birds-eye-view";
import { createRoot, Root } from "react-dom/client";

import { NoteType } from "./ul/note";

export class BirdsEyeView extends ItemView {
	private notes: NoteType[];
	private root: Root;
	private defaultSortCond: SortCondType;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return BIRDS_EYE_VIEW_TYPE;
	}

	getDisplayText() {
		return "Bird's eye view";
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
	}

	private injectDOM() {
		console.log("injectDom");
		const dispatchOpen = (filePath: string, split: boolean) => {
			console.log("dispatch", filePath);
			const file = this.app.vault.getAbstractFileByPath(filePath);
			if (file instanceof TFile) {
				this.app.workspace
					.getLeaf(split)
					.openFile(file)
					.then(() => {
						console.log("finish", filePath);
					});
			}
		};

		this.root.render(
			<React.StrictMode>
				<BirdsEyePage
					notes={this.notes}
					dispatchOpen={dispatchOpen}
					defaultSortCond={this.defaultSortCond}
				/>
			</React.StrictMode>
		);
	}

	async onClose() {
		ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
	}

	update(notes: NoteType[]) {
		console.log("update");
		this.notes = notes;
		this.injectDOM();
	}

	setDefaultSortCond(defaultSortCond: SortCondType) {
		this.defaultSortCond = defaultSortCond;
	}
}
