import { GroupData } from "@/types/group"
import { MemberDataItem } from "@/types/member"

export abstract class BaseDataLoader {
  public abstract title: string
  public abstract items: string[]
  public abstract desc?: string

  abstract getGroupData(): Promise<GroupData[]>

  abstract getMemberData(id: string): Promise<MemberDataItem[]>
}
