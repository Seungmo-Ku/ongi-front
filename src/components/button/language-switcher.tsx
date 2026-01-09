'use client'

import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

export function LanguageSwitcher() {
    const { i18n } = useTranslation()
    
    const changeLanguage = (lng: 'ko' | 'en') => {
        i18n.changeLanguage(lng)
    }
    
    return (
        <div className='w-full grid grid-cols-2 gap-x-2 p-1 rounded-lg bg-gray-100'>
            <button
                onClick={() => changeLanguage('ko')}
                className={clsx(
                    'w-full py-2 rounded-md text-sm font-semibold transition-colors duration-200',
                    i18n.language === 'ko'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'bg-transparent text-gray-500 hover:bg-gray-200',
                )}
            >
                한국어
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={clsx(
                    'w-full py-2 rounded-md text-sm font-semibold transition-colors duration-200',
                    i18n.language === 'en'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'bg-transparent text-gray-500 hover:bg-gray-200',
                )}
            >
                English
            </button>
        </div>
    )
}
