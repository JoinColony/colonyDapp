#!/bin/bash

exists() {
  command -v "$1" >/dev/null 2>&1
}

if exists chrome-browser; then
  echo "Starting Cypress Framework using Chrome..."
  yarn cypress run --browser chrome
fi

if exists chromium-browser; then
  echo "Starting Cypress Framework using Chromium..."
  yarn cypress run --browser chromium
fi
