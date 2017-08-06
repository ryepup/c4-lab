declare var Github: GithubApi.Github
export default Github

declare namespace GithubApi {

    interface Github {
        new(): Github
        getGist(): Gist
    }

    interface Gist {
        create(opts: GistOptions): Promise<Response<CreateGistResult>>
    }

    interface GistOptions {
        public: boolean
        description: string
        files: {[fileName:string]: FileOptions}
    }

    interface FileOptions {
        content: string
        type?: string
        language?: string
    }

    interface Response<T>{
        data: T
    }

    interface CreateGistResult {
        id: string
        /**
         * human-friendly URL
         */
        html_url: string
        url: string
    }
}