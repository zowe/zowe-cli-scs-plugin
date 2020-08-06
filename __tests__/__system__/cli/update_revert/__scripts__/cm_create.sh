#!/bin/bash
set -e

zowe profiles create zosmf $1 --host localhost --user USERNAME --pass PLAINTEXT --ru false

zowe profiles list zosmf --sc

exit $?
