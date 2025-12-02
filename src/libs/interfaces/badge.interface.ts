import { BadgePerspective } from '@/libs/dto/badge.dto'


export interface IBadge {
    id: string
    perspective_1: BadgePerspective
    perspective_2: BadgePerspective
    perspective_3: BadgePerspective
    selected: number
    checked: false
    createdAt: Date
    imageUrl?: string
}

export class Badge implements IBadge {
    id: string
    perspective_1: BadgePerspective
    perspective_2: BadgePerspective
    perspective_3: BadgePerspective
    selected: number
    checked: false
    createdAt: Date
    imageUrl?: string

    constructor(badge: IBadge) {
        this.id = badge.id
        this.perspective_1 = badge.perspective_1
        this.perspective_2 = badge.perspective_2
        this.perspective_3 = badge.perspective_3
        this.selected = badge.selected || 0
        this.checked = badge.checked || false
        this.createdAt = new Date(badge.createdAt)
        this.imageUrl = badge.imageUrl || ''
    }
}