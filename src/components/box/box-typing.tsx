import Box from '@/components/box/index'
import { motion } from 'framer-motion'


export const BoxTyping = () => {
    
    const vibratingDot = (index: number) => {
        return (
            <motion.div
                className='inline-block w-1 h-1 bg-black/50 rounded-full mx-0.5'
                initial={{ y: 0 }}
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', delay: index * 0.1 }} // 각 점마다 딜레이를 줘서 순차적으로 움직이게 함
            >
            </motion.div>
        )
    }
    
    return (
        <Box.CommunicationText text='' isUser={false} className='mt-[15px] w-fit h-[38px] flex items-center justify-center transition duration-300'>
            {
                <div className='flex flex-row items-center justify-center'>
                    {vibratingDot(0)}
                    {vibratingDot(1)}
                    {vibratingDot(2)}
                </div>
            }
        </Box.CommunicationText>
    )
}