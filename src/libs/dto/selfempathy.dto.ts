import { ISelfEmpathy } from '@/libs/interfaces/self-empathy.interface'


export type SelfEmpathyCreateRequest = Omit<ISelfEmpathy, 'id' | 'createdAt' | 'summary'> & { sid: string }