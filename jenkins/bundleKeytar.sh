#!/bin/bash
set -e

mkdir prebuilds && cd prebuilds
curl -fsLO jq https://github.com/stedolan/jq/releases/latest/download/jq-linux64
chmod +x ./jq

curl -fs https://$1@api.github.com/repos/atom/node-keytar/releases/tags/v$2 |
    jq -c '.assets[] | select (.name | contains("node"))' |
    jq -r -c 'select (.browser_download_url) | .browser_download_url' |
    while IFS=$"\n" read -r c; do curl -sL -o `echo -n $(echo -n $c | md5sum | cut -c1-6)'-'$(basename $c)` $c; done

rm ./jq
cd ..
