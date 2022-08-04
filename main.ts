import {
	App,
	Editor,
	MarkdownView,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
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

		this.app.vault.on("modify", () => {
			console.log("a");
		}),
			this.addSettingTab(
				new BirdsEyeViewPluginSettingTab(this.app, this)
			);

		this.addCommand({
			id: "birds-eye-view-open-view",
			name: "open View",
			callback: () => {
				this.initLeaf();
			},
		});

		this.initLeaf();
	}

	onunload() {
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
		this.app.workspace.getLeaf(true).setViewState({
			type: BIRDS_EYE_VIEW_TYPE,
		});
	}

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
