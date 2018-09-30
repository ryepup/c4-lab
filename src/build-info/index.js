import template from './template.html'

class BuildInfoController {
    constructor() {
        /* global process */
        this.version = process.env.npm_package_version
        this.build = process.env.TRAVIS_BUILD_NUMBER || 'SNAPSHOT'
        this.hash = process.env.TRAVIS_COMMIT || process.env.npm_package_gitHead || 'HEAD'
    }
}

export const name = 'c4LabBuildInfo'
export const options = {
    template: template,
    controller: BuildInfoController
}