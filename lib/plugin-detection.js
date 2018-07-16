const fs = require('fs')
const path = require('path')

function pathJoinFromRoot(...all) {
  return path.join.apply(null, [__dirname, '..'].concat(all));
}

function pathToHookFile(packageName) {
  return pathJoinFromRoot('node_modules', packageName, 'govuk-prototype-kit-hooks.json');
}


const flatten = x => [].concat(...x)
const noEditFn = x => x;

const getMergedArraySync = (hookType, editFn = noEditFn) => flatten(
  Object.keys(require(pathJoinFromRoot('package.json')).dependencies || {})
    .filter(packageName => fs.existsSync(pathToHookFile(packageName)))
    .filter(packageName => fs.statSync(pathToHookFile(packageName)).isFile())
    .map(packageName => editFn(require(pathToHookFile(packageName))[hookType] || [], packageName))
)

const scopeFilePathsToModule = (itemsInPackage, packageName) => itemsInPackage
  .map(item => pathJoinFromRoot('node_modules', packageName, item))

module.exports = {
  getMergedArraySync,
  scopeFilePathsToModule
}
