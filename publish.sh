#!/usr/bin/env bash
set -e

yarn run build:dll
yarn run build
git checkout --orphan temp-gh-pages
rm .gitignore
echo "node_modules" > .gitignore
git reset
git add index.html
git add dist
git add static
git commit -m "Update gh-pages"

git clean -df

git push -f origin temp-gh-pages:gh-pages
git checkout website
git branch -D temp-gh-pages
