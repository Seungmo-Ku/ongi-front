import clsx from 'clsx'


interface SpinnerLoadingProps {
    className?: string
    circleClassName?: string
    pathClassName?: string
}

export const SpinnerLoading = ({
    className = '',
    circleClassName = '',
    pathClassName = ''
}: SpinnerLoadingProps) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'
            className={clsx(
                'animate-spin h-5 w-5 text-inherit',
                className
            )}
        >
            {/* 1. (수정) 트랙 두께를 4에서 2로 변경 */}
            <circle
                className={clsx('opacity-25', circleClassName)}
                cx='12' cy='12' r='10'
                stroke='gray'
                strokeWidth='2'
            ></circle>
            
            {/* 2. (수정) 2px 두께에 맞는 새 path 데이터로 변경 */}
            <path
                className={clsx('opacity-75', pathClassName)}
                fill='black' // (Tailwind로 색상 제어)
                d='M12 1a11 11 0 0 1 11 11h-2a9 9 0 0 0-9-9V1z'
            ></path>
        </svg>
    )
}