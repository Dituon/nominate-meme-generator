/*
Step1: 访问 https://qun.qq.com/member.html
Step2: 登录
Step3: 将此脚本粘贴到控制台运行
*/

const IFRAME_SRC = 'https://nominate.d2n.moe'

const skey = document.cookie.match(/skey=([^;]+)/)?.[1]

if (!skey) {
  alert('请登录后使用本脚本')
  window.location.href = "https://qun.qq.com/member.html"
}

// 腾讯加密逆向
let _t = 5381
for (let _e = skey, _n = 0, _o = _e.length; _n < _o; ++_n)
  _t += (_t << 5) + _e.charAt(_n).charCodeAt()
let bkn = 2147483647 & _t

async function fetchGroup(id) {
  const {members} = await fetch(`https://qinfo.clt.qq.com/cgi-bin/qun_info/get_members_info_v1?gc=${id}&bkn=${bkn}`).then(p => p.json())
  return Object.keys(members).sort((a, b) => members[a].lst - members[b].lst).reverse()
}

const hashToken = '>'

if (location.host === 'qun.qq.com') {
  // 获取所有群聊
  const groups = [...document.querySelectorAll('.my-group-list>li')].map(ele => ({
    name: ele.title, id: ele.getAttribute('data-id')
  }))
  alert(`获取群聊表列成功, 共 ${groups.length} 个; 跳转后请再输入一次脚本`)
  const hash = groups.map(g => `${g.id}${hashToken}${g.name}`).join(hashToken)
  window.location.href = "https://qinfo.clt.qq.com/qinfo_v3/member.html#" + hash
} else if (location.host === 'qinfo.clt.qq.com') {
  const hash = decodeURI(location.hash.substring(1))
  const groups = hash.split(hashToken).reduce(
    (a, v, i) => (i & 1 ? (a[a.length - 1].name = decodeURI(v)) : a.push({id: v}), a), []
  )
  console.log(groups)
  // iframe
  const iframe = document.createElement('iframe')

  window.addEventListener('message', async e => {
    const {type, id} = e.data
    switch (type) {
      case 'groups':
        iframe.contentWindow.postMessage({type, data: groups}, '*')
        break
      case 'members':
        iframe.contentWindow.postMessage({type, data: await fetchGroup(id)}, '*')
        break
    }
  })

  iframe.src = IFRAME_SRC
  iframe.style.cssText = 'width: 100%; height: 100%; border: none;'
  document.body.innerHTML = ''
  document.body.appendChild(iframe)
}

