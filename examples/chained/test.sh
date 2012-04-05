#!/bin/bash

TESTNUMBER=333
TESTSTRING=abc

/usr/bin/env node $(dirname $0)/test --config=$(dirname $0)/myvars
