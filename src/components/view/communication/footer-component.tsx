import Button from '@/components/button'
import CommunicationView from '@/components/view/communication/index'


interface FooterComponentProps {
    isChatting?: boolean // 캐릭터가 혼자 이야기 중이면 false, 카톡처럼 대화 중에는 true
    isSelectingEmotion?: boolean // 감정 선택 중인지 여부
    initialText?: string
    buttonText?: string
    showBackButton?: boolean
    backButtonOnClick?: () => void
    backButtonText?: string
    onClick?: () => void
    onArrowClick?: () => void
    onSendButtonClick?: () => void
    showSendButton?: boolean // 이대로 보낼게 표시 여부
    text: string
    setText: (text: string) => void
    disabled?: boolean
}

export const FooterComponent = ({
    isChatting = false,
    isSelectingEmotion = false,
    initialText = '',
    buttonText = '디디에게 대답하기',
    showBackButton = false,
    backButtonOnClick,
    backButtonText = '아닌 것 같아',
    onClick,
    onArrowClick,
    onSendButtonClick,
    showSendButton = false,
    text,
    setText,
    disabled = false
}: FooterComponentProps) => {
    return (
        <div className='absolute bottom-10 w-full px-5'>
            {
                !isChatting ?
                (
                    showBackButton ? (
                        <div className='w-full grid grid-cols-2 gap-x-2.5'>
                            <Button.Communication onClick={onClick}>
                                {buttonText}
                            </Button.Communication>
                            <Button.Communication onClick={backButtonOnClick}>
                                {backButtonText}
                            </Button.Communication>
                        </div>
                    ) : (
                        <Button.Communication onClick={onClick}>
                            {buttonText}
                        </Button.Communication>
                    )
                
                ) :
                (
                    <CommunicationView.FooterInputSend
                        isSelectingEmotion={isSelectingEmotion}
                        initialText={initialText}
                        onArrowClick={onArrowClick}
                        onSendButtonClick={onSendButtonClick}
                        showSendButton={showSendButton}
                        text={text}
                        setText={setText}
                        disabled={disabled}
                    />
                )
            }
        </div>
    )
}