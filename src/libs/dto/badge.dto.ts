export interface BadgePerspective {
    keyword: string
    description: string
    details: string[]
}

export interface BadgeGetResponse {
    summary: string
    perspective_1: BadgePerspective
    perspective_2: BadgePerspective
    perspective_3: BadgePerspective
}