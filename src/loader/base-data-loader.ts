import { GroupData } from "@/types/group"
import { MemberData } from "@/types/member"

export abstract class BaseDataLoader {
  public abstract title: string
  public abstract items: string[]

  abstract getGroupData(): Promise<GroupData[]>

  abstract getMemberData(id: string): Promise<MemberData[]>
}
