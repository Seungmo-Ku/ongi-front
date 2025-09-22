import Image from 'next/image'


interface CharacterImageProps {
    mode: 'welcome' | 'empathy'
    width?: number
    height?: number
}

export const CharacterImage = ({
    mode,
    width = 220,
    height = 280
}: CharacterImageProps) => {
    return (
        <Image
            src={`/images/character/${mode}.png`}
            alt={mode}
            width={width}
            height={height}
            className='self-center shrink-0 object-cover'
        />
    )
}