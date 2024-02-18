import {BaseDataLoader} from "@/loader/base-data-loader";
import {GroupData} from "@/types/group";
import {MemberData, MemberDataItem} from "@/types/member";

export interface RepoDataLoaderOptions {
  baseUrl: string
  parseGroupUrl?: (baseUrl: string) => string
  parseMemberUrl?: (baseUrl: string, id: string) => string
}

export class RepoDataLoader extends BaseDataLoader {
  public title: string = ''
  public items: string[] = []
  public desc?: string = undefined
  protected cache = new Map<string, MemberData>()

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

  async getMemberData(id: string): Promise<MemberDataItem[]> {
    if (this.cache.has(id)) {
      const {title, desc, items, data} = this.cache.get(id)!
      this.title = title
      this.desc = desc
      this.items = items ?? []
      return data
    }
    const data = await fetch(
      this.options.parseMemberUrl(this.options.baseUrl, id)
    ).then(p => p.json()) as MemberData
    this.cache.set(id, data)
    const {title, desc, items, data: d} = data
    this.title = title
    this.desc = desc
    this.items = items ?? []
    return d
  }
}
