export async function sendAsyncMessage(message: {
    type: string,
    [k: string]: any
}): Promise<any> {
    return new Promise(resolve => {
        const handleMessage = (e: MessageEvent) => {
            const { type, data } = e.data
            if (type === message.type) {
                window.removeEventListener('message', handleMessage)
                resolve(data)
            }
        }

        window.addEventListener('message', handleMessage)
        window.parent.postMessage(message, '*')
    })
}