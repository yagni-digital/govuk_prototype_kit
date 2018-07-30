const fs = require('fs')
const path = require('path')

const pathJoinFromRoot = (...all) => path.join.apply(null, [__dirname, '..'].concat(all))

const pathToHookFile = packageName => pathJoinFromRoot('node_modules', packageName, 'govuk-prototype-kit-hooks.json');

const flatten = x => [].concat(...x)
const noEditFn = x => x;

const fakeConfigs = {
  'govuk-frontend': {
    nunjucksDirs: ['/', 'components'],
    scripts: ['/all.js'],
    globalAssets: ['/assets'],
    sassIncludes: ['/all.scss']
  }
}

const lookupConfig = packageName => hookFileExists(packageName) ? require(pathToHookFile(packageName)) : fakeConfigs[packageName]

const hookFileExists = packageName => fs.existsSync(pathToHookFile(packageName)) && fs.statSync(pathToHookFile(packageName)).isFile()

const getMergedArraySync = (hookType, editFn = noEditFn) => flatten(
  Object.keys(require(pathJoinFromRoot('package.json')).dependencies || {})
    .filter(packageName => (hookFileExists(packageName)) || fakeConfigs.hasOwnProperty(packageName))
    .map(packageName => editFn(lookupConfig(packageName)[hookType] || [], packageName))
)

const publicPathGenerator = contextPathName => (itemsInPackage, packageName) => itemsInPackage
  .map(item => item.startsWith('/') ? item : `/${item}`)
  .map(item => ['', contextPathName, packageName].map(encodeURIComponent).join('/') + item)

const publicPrivateGenerator = (publicMapper, privateMapper) => (itemsInPackage, packageName) => itemsInPackage
  .map(item => ({
    privatePath: privateMapper([item], packageName)[0],
    publicPath: publicMapper([item], packageName)[0]
  }))

const scopeFilePathsToModule = (itemsInPackage, packageName) => itemsInPackage
  .map(item => pathJoinFromRoot('node_modules', packageName, item))

const publicScriptPaths = publicPathGenerator('plugin-scripts')
const publicAssetPaths = publicPathGenerator('plugin-assets')

const transform = {
  scopeFilePathsToModule,
  publicScriptPaths,
  publicAssetPaths,

  privateAndPublicScriptPaths: publicPrivateGenerator(publicScriptPaths, scopeFilePathsToModule),
  privateAndPublicAssetPaths: publicPrivateGenerator(publicAssetPaths, scopeFilePathsToModule),
  privateAndPublicGlobalAssetPaths: publicPrivateGenerator(itemsInPackage => itemsInPackage.map(_ => '/assets'), scopeFilePathsToModule)
}

module.exports = {
  getMergedArraySync,
  transform
}
