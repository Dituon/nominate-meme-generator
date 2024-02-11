import { BaseDataLoader } from "@/loader/base-data-loader";
import { GroupData } from "@/types/group";
import { MemberData } from "@/types/member";
import { QQGroupDataDTO } from "@/types/qq-group-dto/group";
import { QQMemberDataDTO } from "@/types/qq-group-dto/member";
import { sendAsyncMessage } from "@/utils/async-window-message";

export class QQGroupDataLoader extends BaseDataLoader {
  protected groupDataPromise?: Promise<GroupData[]>
  protected memberDataPromiseMap: { [groupId: string]: Promise<MemberData[]> } = {}

  constructor() {
    super()

    if (window.parent === window) { // inject mode
      return
    }

    window.parent.postMessage({
      type: 'groups'
    }, '*')
  }

  async getGroupData(): Promise<GroupData[]> {
    if (!this.groupDataPromise) {
      const data = await sendAsyncMessage({ type: 'groups' })
      const d = (data as QQGroupDataDTO).map(d => {
        //@ts-ignore
        d.avatar = QQGroupDataLoader.parseGroupAvatar(d.id)
        return d as GroupData
      })
      this.groupDataPromise = Promise.resolve(d);
    }

    return this.groupDataPromise
  }

  async getMemberData(groupId: string): Promise<MemberData[]> {
    if (!this.memberDataPromiseMap[groupId]) {
      const data = await sendAsyncMessage({ 
        type: 'members', 
        groupId
      })
      const d: MemberData[] = (data as QQMemberDataDTO).members.map(m => ({
        id: m,
        name: m,
        avatar: QQGroupDataLoader.parseMemberAvatar(m),
      }))
      this.memberDataPromiseMap[groupId] = Promise.resolve(d);
    }

    return this.memberDataPromiseMap[groupId]
  }


  static parseMemberAvatar(id: string): string {
    return `http://q1.qlogo.cn/g?b=qq&nk=${id}&s=640`
  }

  static parseGroupAvatar(id: string): string {
    return `http://p.qlogo.cn/gh/${id}/${id}/640/`
  }
}
