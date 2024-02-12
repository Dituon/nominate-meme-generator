import {BaseDataLoader} from "@/loader/base-data-loader";
import {GroupData} from "@/types/group";
import {MemberData} from "@/types/member";

export interface RepoDataLoaderOptions {
  baseUrl: string
  parseGroupUrl?: (baseUrl: string) => string
  parseMemberUrl?: (baseUrl: string, id: string) => string
}

export class RepoDataLoader extends BaseDataLoader {
  public title: string = ''
  public items: string[] = []

  readonly options: Required<RepoDataLoaderOptions>
  constructor(options: RepoDataLoaderOptions) {
    super()
    options.parseGroupUrl ??= baseUrl => `${baseUrl}/groups.json`
    options.parseMemberUrl ??= (baseUrl, id) => `${baseUrl}/zh/${id}.json`
    this.options = options as Required<RepoDataLoaderOptions>
  }

  async getGroupData(): Promise<GroupData[]> {
    return fetch(this.options.parseGroupUrl(this.options.baseUrl)).then(p => p.json())
  }

  async getMemberData(id: string): Promise<MemberData[]> {
    const {title, items, data} = await fetch(this.options.parseMemberUrl(this.options.baseUrl, id)).then(p => p.json())
    this.title = title
    this.items = items
    return data
  }
}
