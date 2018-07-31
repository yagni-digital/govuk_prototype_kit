const fs = require('fs')
const path = require('path')

const pathJoinFromRoot = (...all) => path.join.apply(null, [__dirname, '..'].concat(all))

const pathToHookFile = packageName => pathJoinFromRoot('node_modules', packageName, 'govuk-prototype-kit-hooks.json')

const flatten = x => [].concat(...x)
const noEditFn = x => x

const defaultConfigs = {
  'govuk-frontend': {
    nunjucksDirs: ['/', 'components'],
    scripts: ['/all.js'],
    globalAssets: ['/assets'],
    sassIncludes: ['/all.scss']
  }
}

const lookupConfig = packageName => hookFileExists(packageName) ? require(pathToHookFile(packageName)) : defaultConfigs[packageName]

const hookFileExists = packageName => fs.existsSync(pathToHookFile(packageName)) && fs.statSync(pathToHookFile(packageName)).isFile()

const getList = (hookType, editFn = noEditFn) => flatten(
  Object.keys(require(pathJoinFromRoot('package.json')).dependencies || {})
    .filter(packageName => (hookFileExists(packageName)) || defaultConfigs.hasOwnProperty(packageName))
    .map(packageName => editFn(lookupConfig(packageName)[hookType] || [], packageName))
)

const generateServersideAndAssetPaths = generatePublicPath => (itemsInPackage, packageName) => itemsInPackage
  .map(item => ({
    filesystemPath: scopeFilePathToModule(item, packageName),
    publicPath: generatePublicPath(item, packageName)
  }))

const addLeadingSlash = item => item.startsWith('/') ? item : `/${item}`

const publicPathGenerator = (item, packageName) => ['', 'plugin-assets', packageName].map(encodeURIComponent)
  .join('/') + addLeadingSlash(item)

const scopeFilePathToModule = (item, packageName) => pathJoinFromRoot('node_modules', packageName, item)

const iterateItems = processor => (items, packageName) => items.map(item => processor(item, packageName))

const transform = {
  scopeFilePathsToModule: iterateItems(scopeFilePathToModule),
  publicAssetPaths: iterateItems(publicPathGenerator),

  filesystemPathAndPublicAssetPaths: generateServersideAndAssetPaths(publicPathGenerator),
  filesystemPathAndGlobalAssetPaths: generateServersideAndAssetPaths(_ => '/assets')
}

module.exports = {
  getList,
  transform
}
