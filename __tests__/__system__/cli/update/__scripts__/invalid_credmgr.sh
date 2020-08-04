#!/bin/bash

credMgr=`zowe config get CredentialManager`
zowe config reset CredentialManager

zowe scs update

zowe config set CredentialManager $credMgr

exit $?
