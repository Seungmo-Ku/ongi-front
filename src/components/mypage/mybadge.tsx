'use client'

import { StampComponent } from '@/components/mypage/badge/stamp'


export const MyBadge = () => {
    return (
        <div className='w-full flex flex-col items-center justify-start px-2 gap-y-5 mt-6'>
            <StampComponent/>
        </div>
    )
}