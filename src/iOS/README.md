## 프로젝트 환경

- 인원: 5명 (iOS 1, FE 2, BE 1)
- 기간: 2025.01 ~ 2025.02 (2개월)
- 최소 버전: iOS 17 +
- 기술 스택
    - **Reactive Programming**: UIKit + RxSwift
    - **Architecture**: ReactorKit, MVVM-in/out
    - **Network**: URLSession, SwiftConcurrency, StompClientLib
    - **Data Base**: Realm
    - **Test**: SwiftTesting
    - WKWebView, SwiftMacro

<br/>

## **주요기능**

- `홈 화면` : 참여할 수 있는 kickRoom을 조회하고 새로운 kickRoom을 생성할 수 있습니다.
    - kickRoom은 유저당 최대 5개를 생성할 수 있으며, 초과 시 kickRoom을 삭제하는 화면으로 전환할 수 있습니다.
- `kickRoom 화면` : 영상을 함께 시청하고, 제어할 수 있습니다.
    - **재생/일시정지 상태, 영상 시간 동기화:** 영상 정보를 웹소켓을 주고 받아 방 안의 모든 사용자에게 같은 영상, 같은 상태를 제공합니다.
    - **영상 플레이리스트 동기화:** 영상의 추가/삭제/순서 변경을 동기화하여 모두에게 같은 플레이리스트를 제공합니다.
    - **실시간 채팅**: 채팅을 통해 함께 대화를 나눌 수 있습니다.
    - **참여자 조회:** 현재 채팅방의 참여자를 조회하고, 제어 권한을 부여할 수 있습니다.
- `내가 속한 kickRoom 화면` : 내가 속한 kickRoom을 조회할 수 있습니다.
    - 내가 속한 kickRoom을 조회 및 나가기/삭제를 할 수 있습니다.

<br/>

## 화면
| 홈 & 방 생성 | 플레이리스트 편집 | 사용자 정보 조회 |
|-|-|-|
|![방생성](https://github.com/user-attachments/assets/87825f13-74cf-42fe-8778-eb9945b5ff75)|![플레이리스트_편집](https://github.com/user-attachments/assets/c6f27b00-679c-44c1-8056-24d8fd875f2f)|![권한변경](https://github.com/user-attachments/assets/dc6947e0-5271-47ae-bf65-a45a0a86c523)|

| 영상 동기화 | 채팅 및 실시간 권한 변경 |
|-|-|
|![화면 기록 2025-02-25 오전 10 50 08](https://github.com/user-attachments/assets/021c391d-ef32-4781-ba5c-3cf7931ac1f3)|![9  권한변경](https://github.com/user-attachments/assets/c696a650-0cbf-49e9-9adc-0500af81dd8a)|

<br/>

## 아키텍처

- `단방향 데이터 흐름`: 아키텍처를 활용하여 **상태(State)**와 **이벤트(Action)**를 명확히 관리할 수 있습니다.
    
   ![image](https://github.com/user-attachments/assets/cec773f1-4b26-4658-adab-5a7849b6f884)

    
    - 혼자 개발할 때도 임의대로 작성하지 않도록 구조화된 패턴을 채택하여 코드의 일관성과 유지보수성을 높였습니다.
    - 상태 변경은 **Mutation**에서만 이루어지도록 설계하여 데이터 관리의 일관성 유지 및 빠른 TroubleShooting이 가능합니다.
- BaseView와 BaseViewController를 도입해 공통 로직을 캡슐화하고 **재사용성**을 강화했습니다.

<br/>

## 기술 스택 상세

### **네트워크(HTTP 통신)**

- **`Pipeline`**: 데이터를 처리하는 여러 단계를 체계적으로 연결하여, 데이터를 순차적으로 처리하고 변환하는 디자인 패턴을 사용했습니다.
    
   ![image](https://github.com/user-attachments/assets/f038e9bc-ec8a-4c5b-9c0f-f87c23daa352)

    
    - `Request` 프로토콜을 사용하여 각 `Endpoint`의 구성 요소를 명세 및, `URLRequestBuildable` 을 채택하여 네트워크 요청을 수행할 준비를 하는 `URLRequest`를 생성합니다.
    - Endpoint는 response에 따라 어떤 처리를 할 지를 정의하는 `ResponsePipeline` 을 가집니다.
        - `redirector` : HTTP 상태 코드에 따라 pipeline에 정의되어 있는 action을 실행하여 로그인, 토큰 재갱신, 에러처리 등을 담당합니다.
        - `terminator`: response를 parsing합니다. JSON 파서와 String 파서를 동적으로 선택하여 다양한 데이터 형식을 처리합니다.
    - protocol을 기반을 설계되어, 각각의 구성 요소는 리스코프 치환 원칙(**LSP**)을 준수하며 교체 가능하도록 설계하여, **요청을 처리하고 응답 데이터를 변환하는 체인 역할을 수행합니다.**
- **`Router Pattern`**: API의 엔드포인트와 네트워크 요청 정보를 중앙에서 관리하여 필요한 시점에 호출만 하면 사용할 수 있도록 설계했습니다.
    - 자주 사용되는 **이미지 요청**을 전역적으로 정의하여 동일한 코드 패턴을 반복할 필요 없이, 재사용 가능한 구조로 효율적인 네트워크 요청을 할 수있습니다.
    - URL값을 Key값으로 하는 `NSCache`를 사용하여 동일한 요청에 대해 불필요한 네트워크 요청을 방지하고, 성능을 최적화했습니다.

### Swift Concurrency

![image](https://github.com/user-attachments/assets/575f9cf4-ecbb-4493-bb00-35df78a6632b)

- `Xcode instruments` 를 사용해 앱 내에서 사용되는 유튜브 썸네일 데이터 **10개를 100번** 요청하는 테스트에서, **GCD를 사용했을 때는 약 30초의 CPU 사용률을** 보였고, **Swift Concurrency를 사용한 경우 약 4초의 CPU 사용률**을 확인했습니다.
- GCD는 매 요청마다 새로운 스레드를 생성하여 Context Switching 비용이 발생하는 반면, Swift Concurrency는 `스레드를 재사용하여 성능을 최적화함을 확인`할 수 있었습니다. 이를 통해 네트워크 통신에서 더 효율적이고 안정적인 처리가 가능한 Swift Concurrency를 사용하였습니다.

### Socket 연결 관리

- 소켓 연결의 안정성을 확보하기 위해 `heart-beat`을 사용하여 연결 상태를 주기적으로 체크하고, 연결이 끊어지지 않도록 유지했습니다.
- **background**로 전환되거나 **foreground**로 복귀할 때, 소켓 연결을 자동으로 종료하고 재연결하여 불필요한 리소스 소비를 방지했습니다. 이로 인해 사용자가 앱을 사용할 때만 연결을 유지하며, 효율적인 리소스 관리를 실현했습니다.
    - background로 전환될 때 SceneDelegate의 `sceneDidEnterBackground` 메서드에서 Socket 연결을 종료합니다.
    - foreground로 복귀할 때 SceneDelegate의 `sceneWillEnterForeground` 메서드에서 Socket을 연결합니다.

### Swift Macro

- **ManipulateDataModel** 라이브러리를 사용하여, 데이터 모델 관리를 자동화하여 코드의 복잡도 감소와 human error를 최소화하였습니다.
    - CodingKeys 대신 @DecodeDTO, @EncodeDTO, @Key를 사용하여 간편하게 JSON 파싱하였습니다.
    - @ConvertToDomainModel, @ConvertToDTOModel를 사용하여 DTO와 DomainModel 변환을 컴파일 시점에 자동으로 생성하여, 변환 로직 중복을 방지하고 유지보수성을 높였습니다.
- 프로젝트에서 **34개의 파일에 적용하여 100줄 이상의 코드를 절감**하였습니다.

### Swift Testing

- 기존의 XCTest 대신 일반적인 연산자와 표현식을 사용하여 네트워크 테스트인 `Swift Testing`를 진행하였습니다.
- 네트워크 요청을 테스트할 수 있도록 Session 클래스의 URLSession이 Protocol을 채택하여, DI를 활용한 네트워크 의존성 주입 구조를 설계했습니다. 네트워크와의 의존성을 최소화하하였습니다.
- Mock 네트워크 요청 함수와 Mock 데이터를 활용하여 독립적인 네트워크 테스트 환경을 구성했습니다. 이를 통해 실제 네트워크 환경과 관계없이 올바른 결과를 확인할 수 있었습니다.

### WebView

- WKWebView를 사용하여 회원가입 페이지를 로드하고, JavaScript와 네이티브 iOS 앱 간의 상호작용을 통해 회원가입이 성공했을 때, 네이티브 앱으로 데이터를 전달받아 로그인 화면으로 돌아가도록 구현했습니다.
- JavaScript에서 송신한 Message를 iOS에서 WKScriptMessageHandler를 통해 수신하고, “signup” action에 대해서 “success”를 응답받으면 WebView를 dismiss하고 iOS 로그인 화면으로 돌아갑니다.

<br/>

## TroubleShooting

[유튜브 재생 시간 Pub/Sub 문제](https://github.com/sgdevcamp2025/kickzo/pull/236)

[선택하지 않은 cell 동작 문제](https://github.com/sgdevcamp2025/kickzo/pull/168)

[CollectionView 리로드 리소스 낭비 문제](https://github.com/sgdevcamp2025/kickzo/pull/168)

[keyboard 중복 레이아웃 문제](https://github.com/sgdevcamp2025/kickzo/pull/168)

[YoutubePlayerView 초기화 문제](https://github.com/sgdevcamp2025/kickzo/pull/209)

<br/>

## 회고

- **개발 과정에서 느낀 점**
    
    혼자 개발을 진행해야 한다는 부담감이 있었지만, **ReactorKit**의 특징 덕분에 나름 **일관성 있는 코드 작성과 빠른 문제 해결**이 가능했습니다. 특히, 이러한 과정에서 얻은 경험들을 기록으로 남길 수 있었던 점이 큰 도움이 되었습니다.
    
- **네트워크 설계에서의 경험**
    
    프로젝트에서 **Pipeline**과 **Router Pattern**을 모두 도입했습니다.
    
    - **Pipeline**: HTTP Response Code에 따른 대처를 미리 정의하고 사용할 수 있어 편리했지만, 매번 Request를 생성해야 하는 번거로움이 있었습니다.
    - **Router Pattern**: 미리 정의한 Request를 반복 사용해 **재사용성**이 뛰어났습니다.
    - 이 두 가지 방법의 장단점을 직접 경험하며, **상황에 따라 적합한 방식을 판단하는 역량**을 기를 수 있었습니다.
- **추가적인 개선 작업**
    
    캠프 기간 중 처리하지 못했던 **소켓 연결 관리와 WebView 처리**를 리팩토링 시점에서 해결할 수 있었습니다. 이를 통해 코드의 품질을 더욱 향상시키고 프로젝트에 기여할 수 있었습니다.
    
- **아쉬운 점**
    
    **Push Notification을 위한 서버를 직접 구축**해보고 싶었지만, 프로젝트 내 다른 작업들이 우선순위가 높아 시도하지 못한 점이 아쉽습니다. 향후 여유가 생긴다면 반드시 도전해 보고 싶은 목표로 남겨두고 싶습니다.
