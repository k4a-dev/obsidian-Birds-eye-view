import { ItemView, WorkspaceLeaf } from "obsidian";

export const BIRDS_EYE_VIEW_TYPE = "birds-eye-view";

export class BirdsEyeView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return BIRDS_EYE_VIEW_TYPE;
	}

	getDisplayText() {
		return "Example view";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h4", { text: "Example view" });

		const allMarkdownFiles = this.app.vault.getMarkdownFiles();
		console.log(allMarkdownFiles);
	}

	async onClose() {
		// Nothing to clean up.
	}
}
