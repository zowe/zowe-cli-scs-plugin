/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

const fs = require("fs");
const glob = require("glob");
const join = require("path").join;

try {
    // Rename TGZ to include version and platform info
    const [oldFile] = glob.sync("*.tgz");
    const packageJson = require(join(__dirname, "..", "package.json"));
    const pkgName = packageJson.name.split("/")[1];
    const pkgVersion = packageJson.version;
    const nodeVersion = process.version.split(".")[0];
    const platform = process.platform;
    const arch = process.arch;
    const newFile = `${pkgName}-v${pkgVersion}-node-${nodeVersion}-${platform}-${arch}.tgz`;
    fs.renameSync(oldFile, newFile);
    console.log(`::set-output name=artifact::${newFile}`);
} catch (err) {
    console.error(err);
}
