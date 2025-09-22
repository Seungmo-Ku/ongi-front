import { ISelfEmpathy } from '@/libs/interfaces/self-empathy.interface'


export type SelfEmpathyCreateRequest = Omit<ISelfEmpathy, '_id' | 'createdAt' | 'summary'> & { sid: string }