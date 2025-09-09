'use client'

import { useDirectionalRouter } from '@/hooks/use-directional-router'


const CommunicationPage = () => {
    const { back } = useDirectionalRouter()
    
    return (
        <div className='bg-black'>
            <button onClick={() => {
                back()
            }}>
                Go Back
            </button>
        </div>
    )
}

export default CommunicationPage