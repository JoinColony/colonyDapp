#!/bin/bash

flow check --json | flow-junit-transformer > reports/flow/flow-results.xml && test ${PIPESTATUS[0]} -eq 0
