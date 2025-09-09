import Button from '@/components/button'
import CommunicationView from '@/components/view/communication/index'


interface FooterComponentProps {
    isChatting?: boolean // 캐릭터가 혼자 이야기 중이면 false, 카톡처럼 대화 중에는 true
}

export const FooterComponent = ({
    isChatting = false
}: FooterComponentProps) => {
    return (
        <div className='absolute bottom-10 w-full px-5'>
            {
                isChatting ?
                <CommunicationView.FooterInputSend/> :
                <Button.Communication>
                    디디에게 대답하기
                </Button.Communication>
            }
        </div>
    )
}