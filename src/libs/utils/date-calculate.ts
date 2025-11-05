/**
 * 입력된 날짜가 속한 주의 일요일 날짜를 "YYYY-MM-DD" 문자열 키로 반환합니다.
 * (예: 10월 29일(수) -> "2025-10-26")
 * (예: 10월 26일(일) -> "2025-10-26")
 * (예: 11월 1일(토)  -> "2025-10-26")
 */
export const getWeekSundayDate = (date: Date): number => {
    // 1. 원본 날짜를 훼손하지 않기 위해 새 객체 생성
    const d = new Date(date)
    
    // 2. 현재 요일(0~6)만큼 날짜를 "뒤로" 이동시킵니다.
    // (예: 수요일(3)이면 3일을 빼서 일요일(0)로 이동)
    d.setDate(d.getDate() - d.getDay())
    
    // 3. 안정적인 문자열 키로 포맷 (YYYY-MM-DD)
    // (getMonth()는 0부터 시작하므로 +1)
    return d.getDate()
}