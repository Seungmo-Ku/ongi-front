// global.d.ts (또는 inappwebview.d.ts)

// 1. InAppWebView 객체의 타입을 정의합니다.
//    callHandler는 string 핸들러 이름과 나머지 인자들을 받고, Promise를 반환합니다.
interface InAppWebView {
    callHandler(handlerName: string, ...args: unknown[]): Promise<unknown>;
}

declare global {
    interface Window {
        // 3. 'window.flutter_inappwebview'가 존재할 수도 있다고(optional '?' 사용)
        //    InAppWebView 타입으로 알려줍니다.
        flutter_inappwebview?: InAppWebView;
    }
}

export {};