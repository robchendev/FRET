const fs = require("fs");
const path = require("path");
module.exports = {
    /**
     * Loads files from the specified directory in a recursive fashion to deep dive through the directory and ensure all files are loaded, not just top level files.
     * @param {String} directory The directory to load files from.
     * @param {String} extension The extension, if any, that files must match. If left empty, all files will be returned.
     * @returns A collection of files that were found.
     */
    loadFilesRecursive: function (directory, extension) {
        let files = [];
        fs.readdirSync(directory).forEach(file => {
            const filePath = path.join(directory, file);
            if (fs.statSync(filePath).isDirectory()) {
                let recursiveFiles = this.loadFilesRecursive(filePath);
                recursiveFiles.forEach(f => files.push(f));
            }
            else if (extension === undefined || extension === null || file.endsWith(extension))
                files.push(filePath);
        });

        return files;
    }
};