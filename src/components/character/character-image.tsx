import Image from 'next/image'


interface CharacterImageProps {
    mode: 'welcome' | 'empathy'
}

export const CharacterImage = ({
    mode
}: CharacterImageProps) => {
    return (
        <Image
            src={`/images/character/${mode}.png`}
            alt={mode}
            width={220}
            height={280}
            className='self-center shrink-0 object-cover'
        />
    )
}