'use client'

import { Badge } from '@/libs/interfaces/badge.interface'
import { useMemo } from 'react'
import { LockKeyhole } from 'lucide-react'
import { useSetAtom } from 'jotai'
import { DialogSheetSelectBadgeAtom } from '@/components/dialog/dialog-sheet-select-badge'
import { DialogSheetViewBadgeAtom } from '@/components/dialog/dialog-sheet-view-badge'


interface BadgeImageProps {
    badge: Badge
}

export const BadgeImage = ({
    badge,
    ...props
}: BadgeImageProps) => {
    
    const isNotSelected = useMemo(() => {
        return badge.selected === -1
    }, [badge.selected])
    
    const setDialogSheetSelectBadgeAtom = useSetAtom(DialogSheetSelectBadgeAtom)
    const setDialogSheetViewBadgeAtom = useSetAtom(DialogSheetViewBadgeAtom)
    
    const keyword = useMemo(() => {
        if (!badge) return ''
        switch (badge.selected) {
            case 0:
                return badge.perspective_1.keyword
            case 1:
                return badge.perspective_2.keyword
            case 2:
                return badge.perspective_3.keyword
            default:
                return ''
        }
    }, [badge])
    
    return (
        <div {...props} className='w-full flex flex-col items-center justify-start gap-y-4 shrink-0'>
            {
                isNotSelected ? (
                    <div
                        className='w-full aspect-square rounded-full flex items-center justify-center p-5 bg-[#EBEBEB]'
                        onClick={() => {
                            setDialogSheetSelectBadgeAtom({
                                badge,
                                open: true
                            })
                        }}
                    >
                        <LockKeyhole className='w-full text-gray-800'/>
                    </div>
                ) : (
                    <div
                        className='w-full flex flex-col items-center justify-start gap-y-4 shrink-0'
                        onClick={() => {
                            setDialogSheetViewBadgeAtom({
                                badge,
                                open: true
                            })
                        }}
                    >
                        <img
                            src={badge.imageUrl}
                            alt={badge.imageUrl}
                            className='w-full aspect-square rounded-full object-cover'
                        />
                        <p className='text-13-regular text-black'>
                            {keyword}
                        </p>
                    </div>
                )
            }
        </div>
    )
}