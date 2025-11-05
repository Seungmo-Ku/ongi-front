export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            if (reader.result) {
                resolve(reader.result.toString())
            } else {
                reject(new Error('File conversion failed'))
            }
        }
        reader.onerror = (error) => reject(error)
    })
}

export function base64ToBlob(base64String: string, mimeType: string): Blob {
    // data URI에서 접두사 제거
    const parts = base64String.split(',')
    if (parts.length < 2) {
        throw new Error('Invalid Base64 string format')
    }
    const byteString = atob(parts[1]) // Base64 디코딩
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const uint8Array = new Uint8Array(arrayBuffer)
    for (let i = 0 ; i < byteString.length ; i++) {
        uint8Array[i] = byteString.charCodeAt(i)
    }
    return new Blob([uint8Array], { type: mimeType })
}

export function isBase64Image(str: string): boolean {
    return str.startsWith('data:image')
}