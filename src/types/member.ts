export interface MemberData {
  title: string
  desc?: string
  items?: string[]
  filter?: string[]
  data: MemberDataItem[]
}

export interface MemberDataItem {
    id: string,
    name: string,
    avatar: string,
}
