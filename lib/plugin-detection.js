const fs = require('fs')
const path = require('path')

const pathJoinFromRoot = (...all) => path.join.apply(null, [__dirname, '..'].concat(all))

const pathToHookFile = packageName => pathJoinFromRoot('node_modules', packageName, 'govuk-prototype-kit-hooks.json');

const flatten = x => [].concat(...x)
const noEditFn = x => x;

const fakeConfigs = {
  'govuk-frontend': {
    nunjucksDirs: ['/', 'components'],
    scripts: ['/all.js']
  }
}

const lookupConfig = packageName => hookFileExists(packageName) ? require(pathToHookFile(packageName)) : fakeConfigs[packageName]

const hookFileExists = packageName => fs.existsSync(pathToHookFile(packageName)) && fs.statSync(pathToHookFile(packageName)).isFile()

const getMergedArraySync = (hookType, editFn = noEditFn) => flatten(
  Object.keys(require(pathJoinFromRoot('package.json')).dependencies || {})
    .filter(packageName => (hookFileExists(packageName)) || fakeConfigs.hasOwnProperty(packageName))
    .map(packageName => editFn(lookupConfig(packageName)[hookType] || [], packageName))
)

const transform = {
  scopeFilePathsToModule: (itemsInPackage, packageName) => itemsInPackage
    .map(item => pathJoinFromRoot('node_modules', packageName, item)),

  scopePublicScriptPaths: (itemsInPackage, packageName) => itemsInPackage
    .map(item => item.startsWith('/') ? item : `/${item}`)
    .map(item => ['', 'plugin-scripts', packageName].map(encodeURIComponent).join('/') + item),

  privateAndPublicScriptNames: (itemsInPackage, packageName) => itemsInPackage
    .map(item => ({
      privatePath: transform.scopeFilePathsToModule([item], packageName)[0],
      publicPath: transform.scopePublicScriptPaths([item], packageName)[0]
    }))
}

module.exports = {
  getMergedArraySync,
  transform
}
