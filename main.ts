import {
	addIcon,
	App,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
} from "obsidian";
import { SortCondType } from "src/ul/birdsEyePage";
import { NoteType } from "src/ul/note";
import { BIRDS_EYE_VIEW_TYPE, BirdsEyeView } from "src/view";

import { birdseyeIcon } from "src/ul/icon/icon";

interface BirdsEyeViewPluginSetting {
	showSumbnail: boolean;
	sortCond: SortCondType;
}

const DEFAULT_SETTINGS: BirdsEyeViewPluginSetting = {
	showSumbnail: true,
	sortCond: "updatetime",
};

export default class BirdsEyeViewPlugin extends Plugin {
	settings: BirdsEyeViewPluginSetting;

	async onload() {
		await this.loadSettings();

		this.registerView(
			BIRDS_EYE_VIEW_TYPE,
			(leaf) => new BirdsEyeView(leaf)
		);

		this.app.metadataCache.on("resolved", this.injectView);

		this.addSettingTab(new BirdsEyeViewPluginSettingTab(this.app, this));

		this.addCommand({
			id: "birds-eye-view-open-view",
			name: "open View",
			callback: () => {
				this.initLeaf();
			},
		});

		this.initLeaf();

		addIcon("birdseye", birdseyeIcon);
		this.addRibbonIcon("birdseye", "Open bird's eye view", () =>
			this.initLeaf()
		);
	}

	onunload() {
		this.app.metadataCache.on("resolved", this.injectView);
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
				this.updateViewSettings();
				this.injectView();
			});
	}

	updateViewSettings = async () => {
		const views = this.app.workspace.getLeavesOfType(BIRDS_EYE_VIEW_TYPE);
		views.forEach((leaf) => {
			if (leaf.view instanceof BirdsEyeView)
				leaf.view.setDefaultSortCond(this.settings.sortCond);
		});
	};

	injectView = async () => {
		const views = this.app.workspace.getLeavesOfType(BIRDS_EYE_VIEW_TYPE);
		if (views.length == 0) return;

		const notes: NoteType[] = this.app.vault
			.getMarkdownFiles()
			.map((markdownFile) => this.composeNoteInfo(markdownFile));

		views.forEach((leaf) => {
			if (leaf.view instanceof BirdsEyeView) leaf.view.update(notes);
		});
	};

	private composeNoteInfo = (file: TFile): NoteType => {
		return {
			title: file.name,
			content: "",
			getContent: async () => {
				return await this.readFileContent(file);
			},
			filePath: file.path,
			createtime: file.stat.ctime,
			updatetime: file.stat.mtime,
			sumbNailPath: this.settings.showSumbnail
				? this.getImgPath(file)
				: undefined,
		};
	};

	private getImgPath = (file: TFile) => {
		const metadataCashe = this.app.metadataCache.getFileCache(file);

		if (!metadataCashe || !metadataCashe.embeds) return;
		// 外部の場合
		if (file.path.match(/^https?:\/\//)) {
			console.log(file);
		}
		console.log(metadataCashe);

		// 内部の場合
		const img = this.app.metadataCache.getFirstLinkpathDest(
			metadataCashe.embeds[0].link,
			file.path
		);

		return img ? this.app.vault.getResourcePath(img) : undefined;
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
					this.plugin.settings.showSumbnail = value;
					this.plugin.injectView();
					await this.plugin.saveSettings();
				})
		);

		new Setting(containerEl)
			.setName("Default Sort by")
			.addDropdown((dropdown) => {
				const options: Record<SortCondType, SortCondType> = {
					title: "title",
					createtime: "createtime",
					updatetime: "updatetime",
				};
				dropdown
					.addOptions(options)
					.setValue(this.plugin.settings.sortCond)
					.onChange(async (value) => {
						// @ts-ignore
						this.plugin.settings.sortCond = value;
						this.plugin.updateViewSettings();
						this.plugin.injectView();
						await this.plugin.saveSettings();
					});
			});
	}
}
