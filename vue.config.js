const SourceMapLoader = require('source-map-loader');

module.exports = {
	productionSourceMap: false,
	configureWebpack: {
		devtool: 'eval-source-map', //'cheap-source-map', //'eval',
		output: {
			devtoolModuleFilenameTemplate: (info) => {
				//return "editor://open/?file=C%3A%5Cweb%5Cproject%5Cplaner%5Csrc%5Cgo%5CPort.js&line=107";
				//return `editor://open/?file=${info.resourcePath}&line=`; // ?${info.hash}
				return info.resourcePath;
			},
			//devtoolFallbackModuleFilenameTemplate: 'editor:///[resource-path]?[hash]',
		}
	},
}
