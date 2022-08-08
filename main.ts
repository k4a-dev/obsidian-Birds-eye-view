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
import {
	getDailyNoteSettings,
	IPeriodicNoteSettings,
} from "obsidian-daily-notes-interface";

import dayjs from "dayjs";

interface BirdsEyeViewPluginSetting {
	showSumbnail: boolean;
	excludesDailyNotes: boolean;
	sortCond: SortCondType;
}

const DEFAULT_SETTINGS: BirdsEyeViewPluginSetting = {
	showSumbnail: true,
	excludesDailyNotes: true,
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

		const dailyNoteSettings = getDailyNoteSettings();

		const notes: NoteType[] = this.app.vault
			.getMarkdownFiles()
			.filter((file) =>
				this.filterFileCallback(file, dailyNoteSettings, this.settings)
			)
			.map((file) => this.composeNoteInfo(file));

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

	private filterFileCallback = (
		file: TFile,
		dailyNoteSettings: IPeriodicNoteSettings,
		settings: BirdsEyeViewPluginSetting
	): boolean => {
		if (settings.excludesDailyNotes && isDailyNote(file, dailyNoteSettings))
			return false;
		return true;
	};

	private getImgPath = (file: TFile) => {
		const metadataCashe = this.app.metadataCache.getFileCache(file);

		if (!metadataCashe || !metadataCashe.embeds) return;

		const embed = metadataCashe.embeds[0];

		if (embed.displayText?.length) return undefined;

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

const isDailyNote = (
	file: TFile,
	dailyNoteSettings: IPeriodicNoteSettings
): boolean => {
	const day = dayjs(file.basename, dailyNoteSettings.format);

	if (!day.isValid()) return false;

	if (getParentPath(file.path) !== dailyNoteSettings.folder) return false;

	return true;
};

const getParentPath = (path: string) => {
	return removeFirstSlash(removeTrailingSlash(path))
		.split("/")
		.reduce((prev, cur, index, arr) => {
			if (index === 0) return cur;
			if (index == arr.length - 1) return prev;
			return prev + "/" + cur;
		}, "");
};

function removeTrailingSlash(url: string) {
	return url.replace(/\/$/, "");
}

const removeFirstSlash = (url: string) => {
	return url.replace(/^\//, "");
};

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
			.setName("Excludes Daily Notes")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.excludesDailyNotes)
					.onChange(async (value) => {
						this.plugin.settings.excludesDailyNotes = value;
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
