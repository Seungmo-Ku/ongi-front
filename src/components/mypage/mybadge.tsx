'use client'

import { StampComponent } from '@/components/mypage/badge/stamp'
import { BadgeImage } from '@/components/mypage/badge/badgeimage'
import { useGetAllBadgesQuery } from '@/hooks/use-react-query'


export const MyBadge = () => {
    
    const { data, isLoading } = useGetAllBadgesQuery()
    
    return (
        <div className='w-full flex flex-col items-center justify-start px-2 gap-y-12 mt-6'>
            <StampComponent/>
            <div className='w-full flex flex-col items-center justify-start gap-y-6'>
                <p className='text-16-bold text-black self-start'>모은 배지</p>
                <div className='w-full grid grid-cols-3 gap-x-[22px] gap-y-7'>
                    {
                        isLoading ? null : (
                            data?.map((badge, index) => (
                                <BadgeImage
                                    key={`my-badge-${index}`}
                                    badge={badge}
                                />
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    )
}