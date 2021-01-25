#!/bin/bash

cd /root/work/bewanila
let timeOut=$[($RANDOM%2) + 1 ]
echo "sleeping for "$timeOut
sleep $[($timeOut)]m;
echo "executing"
npm run worktimeOutExtern
