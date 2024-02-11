import { GroupData } from "@/types/group"
import { MemberData } from "@/types/member"

export abstract class BaseDataLoader {
  abstract getGroupData(): Promise<GroupData[]>

  abstract getMemberData(id: string): Promise<MemberData[]>
}
