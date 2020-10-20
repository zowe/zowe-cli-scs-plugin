#!/bin/bash
# Usage: bash bundleKeytar.sh <keytarVersion> [githubAuthHeader]

set -ex
cd "$(git rev-parse --show-toplevel)"

rm -rf prebuilds
mkdir prebuilds && cd prebuilds

curl -fsL -o jq https://github.com/stedolan/jq/releases/latest/download/jq-linux64
chmod +x ./jq

curl -fs https://$2@api.github.com/repos/atom/node-keytar/releases/tags/v$1 |
    ./jq -c '.assets[] | select (.name | contains("node"))' |
    ./jq -cr 'select (.browser_download_url) | .browser_download_url' |
    while read -r bdu; do curl -fsL -o `echo -n $(echo -n $bdu | md5sum | cut -c1-6)'-'$(basename $bdu)` $bdu; done

rm ./jq
cd ..
