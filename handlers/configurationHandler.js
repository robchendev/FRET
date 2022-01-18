module.exports = {
    isDebug: true,
    data: require(`../configurations/config.json`),
    secrets: require(`../secrets.json`),
    flux: undefined,
    initialize: function () {
        let flux = require(`../configurations/flux.prod.json`);
        if (this.isDebug) {
            try {
                flux = require(`../configurations/flux.dev.json`);
            } catch { console.warn("Unable to load a developer flux configuration. Starting with production values."); }
        }

        this.flux = flux;
    }
};