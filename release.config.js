module.exports = {
    branches: [
        {
            name: "master",
            level: "patch",
            devDependencies: {
                "@zowe/imperative": "zowe-v1-lts"
            }
        }
    ],
    plugins: [
        "@octorelease/changelog",
        ["@octorelease/npm", {
            aliasTags: {
                latest: ["zowe-v1-lts"]
            },
            pruneShrinkwrap: true
        }],
        ["@octorelease/github", {
            checkPrLabels: true
        }],
        "@octorelease/git"
    ]
};
