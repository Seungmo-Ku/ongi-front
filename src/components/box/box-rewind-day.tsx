import { SelfEmpathy } from '@/libs/interfaces/self-empathy.interface'
import clsx from 'clsx'
import { Check } from 'lucide-react'


interface BoxRewindDayProps {
    empathy: SelfEmpathy
    index: number
    isLast?: boolean
    selected: boolean
    onClick?: () => void
}

export const BoxRewindDay = ({
    empathy,
    index,
    isLast = false,
    selected,
    onClick = () => {
    },
    ...props
}: BoxRewindDayProps) => {
    
    const checkComponent = (filled: boolean) => {
        return (
            <div className='absolute top-1/2 right-0 translate-x-1.5 -translate-y-5 size-[18px] shrink-0 rounded-full bg-white flex items-center justify-center'>
                <Check className='size-[14px]' style={{
                    color: filled ? '#35618E' : '#D6E4F7'
                }}/>
            </div>
        )
    }
    
    return (
        <div
            {...props}
            className='w-full flex gap-x-5 pl-3'
        >
            <div className={
                clsx('w-1.5 grow bg-white/50 shrink-0 relative',
                    index === 0 ? 'mt-5 rounded-t-[30px]' : '',
                    isLast ? 'mb-5 rounded-b-[30px]' : '')}
            >
                {checkComponent(selected)}
            </div>
            <div
                className={
                    clsx('grow flex flex-col items-start justify-center rounded-[30px] p-4 transition duration-300 active:scale-95 mb-3',
                        selected ? 'bg-white border border-[#578FCA]' : 'bg-white/50 border-none')}
                onClick={onClick}
            >
                <div className='flex items-center justify-start gap-x-2'>
                    <p className='text-[#3674B5] text-16-bold'>
                        {`DAY${index + 1}`}
                    </p>
                    <p className='text-[#747474] text-13-regular'>
                        {`${empathy.createdAt.getMonth() + 1}/${empathy.createdAt.getDate()}`}
                    </p>
                </div>
                <p className='text-15-regular text-black break-keep'>
                    {empathy.summary}
                </p>
            </div>
        </div>
    )
}