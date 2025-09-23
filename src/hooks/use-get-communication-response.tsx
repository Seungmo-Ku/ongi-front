'use client'

import { CommunicationStep1Request, CommunicationStep1Response, CommunicationStep2Request, CommunicationStep2Response, CommunicationStep3Request, CommunicationStep3Response, CommunicationSummaryRequest, CommunicationSummaryResponse } from '@/libs/dto/communication.dto'
import axios from 'axios'


export const useGetCommunicationResponse = () => {
    
    const BASE_URL = process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL
    
    const getCommunicationStep1 = async (Step1Request: CommunicationStep1Request): Promise<CommunicationStep1Response | null> => {
        if (!BASE_URL) return null
        try {
            const response = await axios.post(`${BASE_URL}/selfempathy/step1`, Step1Request)
            if (response.status === 200) {
                return response.data as CommunicationStep1Response
            } else {
                return null
            }
        } catch {
            return null
        }
    }
    
    const getCommunicationStep2 = async (Step2Request: CommunicationStep2Request): Promise<CommunicationStep2Response | null> => {
        if (!BASE_URL) return null
        try {
            const response = await axios.post(`${BASE_URL}/selfempathy/step2`, Step2Request)
            if (response.status === 200) {
                return response.data as CommunicationStep2Response
            } else {
                return null
            }
        } catch {
            return null
        }
    }
    
    const getCommunicationStep3 = async (Step3Request: CommunicationStep3Request): Promise<CommunicationStep3Response | null> => {
        if (!BASE_URL) return null
        try {
            const response = await axios.post(`${BASE_URL}/selfempathy/step3`, Step3Request)
            if (response.status === 200) {
                return response.data as CommunicationStep3Response
            } else {
                return null
            }
        } catch {
            return null
        }
    }
    
    const getCommunicationRewind = async (Step3Request: CommunicationStep3Request): Promise<CommunicationStep3Response | null> => {
        if (!BASE_URL) return null
        try {
            const response = await axios.post(`${BASE_URL}/selfempathy/rewind`, Step3Request)
            if (response.status === 200) {
                return response.data as CommunicationStep3Response
            } else {
                return null
            }
        } catch {
            return null
        }
    }
    
    const getCommunicationSummary = async (SummaryRequest: CommunicationSummaryRequest): Promise<CommunicationSummaryResponse | null> => {
        if (!BASE_URL) return null
        try {
            const response = await axios.post(`${BASE_URL}/selfempathy/summary`, SummaryRequest)
            if (response.status === 200) {
                return response.data as CommunicationSummaryResponse
            } else {
                return null
            }
        } catch {
            return null
        }
    }
    
    return { getCommunicationStep1, getCommunicationStep2, getCommunicationStep3, getCommunicationSummary, getCommunicationRewind }
}