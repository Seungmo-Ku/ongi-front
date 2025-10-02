export interface IAccount {
    uid: string
    email: string
    displayName: string
    photoURL: string
    createdAt: Date
    updatedAt: Date
    exp: number
    level: number
    nickname?: string
}

export class Account implements IAccount {
    uid: string
    email: string
    displayName: string
    photoURL: string
    createdAt: Date
    updatedAt: Date
    exp: number
    level: number
    nickname?: string

    constructor(account: IAccount) {
        this.uid = account.uid
        this.email = account.email
        this.displayName = account.displayName
        this.photoURL = account.photoURL
        this.createdAt = new Date(account.createdAt)
        this.updatedAt = new Date(account.updatedAt)
        this.exp = account.exp || 0
        this.level = account.level || 0
        this.nickname = account.nickname || ''
    }
}