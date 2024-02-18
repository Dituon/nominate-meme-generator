import { BaseDataLoader } from "@/loader/base-data-loader";
import { GroupData } from "@/types/group";
import { MemberDataItem } from "@/types/member";
import { QQGroupDataDTO } from "@/types/qq-group-dto/group";
import { QQMemberDataDTO } from "@/types/qq-group-dto/member";
import { sendAsyncMessage } from "@/utils/async-window-message";

export class QQGroupDataLoader extends BaseDataLoader {
  protected groupDataPromise?: Promise<GroupData[]>
  protected memberDataPromiseMap: { [groupId: string]: Promise<MemberDataItem[]> } = {}

  public title: string = '2023 年度最佳群友提名'
  public items: string[] = [
    "最富裕的群友",
    "最二次元的群友",
    "最可(香)爱(草)的群友",
    "发涩图最多的群友",
    "最活跃的群友",
    "最银乱的群友",
    "游戏领域大神群友",
    "傻到可爱的群友",
    "最佳姐姐/哥哥系",
    "最佳妹妹/弟弟系",
  ]
  public desc = undefined

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

  async getMemberData(groupId: string): Promise<MemberDataItem[]> {
    if (!this.memberDataPromiseMap[groupId]) {
      const data = await sendAsyncMessage({
        type: 'members',
        groupId
      })
      const d: MemberDataItem[] = (data as QQMemberDataDTO).members.map(m => ({
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
