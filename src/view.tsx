import { ItemView, WorkspaceLeaf } from "obsidian";

import React from "react";
import ReactDOM from "react-dom";
import BirdsEyePage from "./ul/birdsEyePage";
export const BIRDS_EYE_VIEW_TYPE = "birds-eye-view";
import { createRoot } from "react-dom/client";

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
		root.render(
			<React.StrictMode>
				<BirdsEyePage />,
			</React.StrictMode>
		);
	}

	async onClose() {
		ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
	}
}
