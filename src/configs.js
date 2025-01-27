const {app} = require("electron");
const fs = require("fs");
const pathsManifest = require("./paths");
const { config } = require("process");

const setConfigDefaults = (configuration) => {
	configuration.keepMinimized = configuration.keepMinimized === undefined ? true : configuration.keepMinimized;
	configuration.startHidden = configuration.startHidden === undefined ? false : configuration.startHidden;
	configuration.enableKeyboardShortcuts = configuration.enableKeyboardShortcuts === undefined ? false : configuration.enableKeyboardShortcuts;
	configuration.enableNodeIntegration = configuration.enableNodeIntegration === undefined ? true : configuration.enableNodeIntegration;
	configuration.openUrlInside = configuration.openUrlInside === undefined ? false : configuration.openUrlInside;
	configuration.useXdgOpen = configuration.useXdgOpen === undefined ? false : configuration.useXdgOpen;
	configuration.thirdPartyAuthLoginMode = configuration.thirdPartyAuthLoginMode === undefined ? false : configuration.thirdPartyAuthLoginMode;
	configuration.useOldUrl = configuration.useOldUrl === undefined ? false : configuration.useOldUrl;
	configuration.languages = configuration.languages === undefined ? undefined : configuration.languages;
	if(process.platform === 'win32'){
		configuration.keepMinimized = true;
	}
	console.log(configuration)
	console.log("?disable-gpu:"+app.commandLine.hasSwitch('disable-gpu'));
}

const loadConfigs = () => {
	try {
		c = JSON.parse(fs.readFileSync(pathsManifest.configsPath, "utf8"));
		setConfigDefaults(c);
		return c;
	} catch (e) {
		console.error(e);
		const defconfig = '{"bounds":{"x":456,"y":229,"width":1105,"height":757},"wasMaximized":false}'
		fs.writeFileSync(pathsManifest.configsPath,defconfig, 'utf8');
		c = JSON.parse(defconfig, "utf-8");
		setConfigDefaults(c);
		return c;
	}
}

const updateConfigs = (updateData) => {
	let configs = loadConfigs();
	configs = Object.assign({}, configs, updateData);
	saveConfigs(configs);
}

const saveConfigs = (configData) => {
	try {
		fs.writeFileSync(pathsManifest.configsPath, JSON.stringify(configData), 'utf8');
	} catch (e) {
		console.error(e);
		return;
	}
}

module.exports = {
	"loadConfigs": loadConfigs,
	"updateConfigs": updateConfigs,
	"saveConfigs": saveConfigs
}