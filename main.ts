import {
	addIcon,
	App,
	Editor,
	MarkdownView,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
} from "obsidian";
import { NoteType } from "src/ul/note";
import { BIRDS_EYE_VIEW_TYPE, BirdsEyeView } from "src/view";

// Remember to rename these classes and interfaces!

interface BirdsEyeViewPluginSetting {
	showSumbnail: boolean;
}

const DEFAULT_SETTINGS: BirdsEyeViewPluginSetting = {
	showSumbnail: true,
};

export default class BirdsEyeViewPlugin extends Plugin {
	settings: BirdsEyeViewPluginSetting;

	async onload() {
		await this.loadSettings();

		this.registerView(
			BIRDS_EYE_VIEW_TYPE,
			(leaf) => new BirdsEyeView(leaf)
		);

		this.app.vault.on("modify", this.injectView);

		this.addSettingTab(new BirdsEyeViewPluginSettingTab(this.app, this));

		this.addCommand({
			id: "birds-eye-view-open-view",
			name: "open View",
			callback: () => {
				this.initLeaf();
			},
		});

		this.initLeaf();

		addIcon(
			"birdseye",
			`<circle cx="50" cy="50" r="47" stroke="currentColor" stroke-width="6"/>
			<path d="M5.7988 71.1924L8.34003 93.9546C8.45774 95.0089 9.37811 95.7878 10.4373 95.7297L31.9445 94.5488C34.0875 94.4311 34.5655 91.4795 32.5692 90.6915L19.0917 85.3714C18.6774 85.2078 18.3295 84.9107 18.1033 84.527L9.50918 69.9545C8.41378 68.0971 5.55954 69.0493 5.7988 71.1924Z" fill="currentColor"/>
			<rect x="22.619" y="22.619" width="15.4762" height="15.4762" rx="1" fill="currentColor"/>
			<rect x="22.619" y="41.6667" width="15.4762" height="15.4762" rx="1" fill="currentColor"/>
			<rect x="22.619" y="60.7143" width="15.4762" height="15.4762" rx="1" fill="currentColor"/>
			<rect x="41.6667" y="22.619" width="15.4762" height="15.4762" rx="1" fill="currentColor"/>
			<rect x="41.6667" y="41.6667" width="15.4762" height="15.4762" rx="1" fill="currentColor"/>
			<rect x="41.6667" y="60.7143" width="15.4762" height="15.4762" rx="1" fill="currentColor"/>
			<rect x="60.7143" y="22.619" width="15.4762" height="15.4762" rx="1" fill="currentColor"/>
			<rect x="60.7143" y="41.6667" width="15.4762" height="15.4762" rx="1" fill="currentColor"/>
			<rect x="60.7143" y="60.7143" width="15.4762" height="15.4762" rx="1" fill="currentColor"/>`
		);

		this.addRibbonIcon("birdseye", "Open bird's eye view", () =>
			this.initLeaf()
		);
	}

	onunload() {
		this.app.vault.off("modify", this.injectView);
		this.app.workspace.detachLeavesOfType(BIRDS_EYE_VIEW_TYPE);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	initLeaf() {
		if (
			this.app.workspace.getLeavesOfType(BIRDS_EYE_VIEW_TYPE).length > 0
		) {
			return;
		}
		this.app.workspace
			.getLeaf(true)
			.setViewState({
				type: BIRDS_EYE_VIEW_TYPE,
			})
			.then(async () => {
				this.injectView();
			});
	}

	private injectView = async () => {
		console.log("inject view");
		const views = this.app.workspace.getLeavesOfType(BIRDS_EYE_VIEW_TYPE);

		const markdownFiles = this.app.vault.getMarkdownFiles();

		let notes: NoteType[] = [];

		for (const file of markdownFiles) {
			const content = await this.readFileContent(file);
			notes.push({
				title: file.name,
				content: content,
				filePath: file.path,
			});
		}

		views.forEach((leaf) => {
			if (leaf.view instanceof BirdsEyeView) leaf.view.update(notes);
		});
	};

	private readFileContent = async (file: TFile) => {
		return await this.app.vault.read(file);
	};

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class BirdsEyeViewPluginSettingTab extends PluginSettingTab {
	plugin: BirdsEyeViewPlugin;

	constructor(app: App, plugin: BirdsEyeViewPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl).setName("Show Sumbnail").addToggle((toggle) =>
			toggle
				.setValue(this.plugin.settings.showSumbnail)
				.onChange(async (value) => {
					console.log("Secret: " + value);
					this.plugin.settings.showSumbnail = value;
					await this.plugin.saveSettings();
				})
		);
	}
}
