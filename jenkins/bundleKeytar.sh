#!/bin/bash
mkdir prebuilds && cd prebuilds
curl -s https://$1@api.github.com/repos/atom/node-keytar/releases/tags/v$2 |
    jq -c '.assets[] | select (.name | contains("node"))' |
    jq -r -c 'select (.browser_download_url) | .browser_download_url' |
    while IFS=$"\n" read -r c; do curl -sL -o `echo -n $(echo -n $c | md5sum | cut -c1-6)'-'$(basename $c)` $c; done
cd ..
