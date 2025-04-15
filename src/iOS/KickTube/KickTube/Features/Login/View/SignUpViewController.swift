////
////  SignUpViewController.swift
////  KickTube
////
////  Created by 김수경 on 2/25/25.
////

import UIKit
import WebKit
import UIKit
import WebKit
import SnapKit

final class SignUpViewController: UIViewController, WKScriptMessageHandler {
    private var webView: WKWebView!
    private var scrollView: UIScrollView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupUI()
        setupWebView()
        loadSignupPage()
        
        // 초기 스크롤 위치 설정
        DispatchQueue.main.async { [weak self] in
            self?.scrollView.contentOffset = CGPoint(x: 0, y: 80)
        }
    }
    
    // MARK: - Setup UI
    
    private func setupUI() {
        scrollView = UIScrollView()
        scrollView.showsVerticalScrollIndicator = true
        scrollView.showsHorizontalScrollIndicator = true
        scrollView.contentInsetAdjustmentBehavior = .automatic
        view.addSubview(scrollView)
        
        scrollView.snp.makeConstraints { make in
            make.edges.equalTo(view.safeAreaLayoutGuide)
        }
    }
    
    private func setupWebView() {
        let contentController = WKUserContentController()
        contentController.add(self, name: "LoginSuccess") // 해당 이름으로 메시지를 식별하거나 보낼 수 있게 된다.
        
        let webConfiguration = WKWebViewConfiguration()
        webConfiguration.userContentController = contentController
        
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.navigationDelegate = self
        
        // 줌 및 스크롤 가능 설정
        webView.scrollView.isScrollEnabled = true
        webView.scrollView.minimumZoomScale = 0.5
        webView.scrollView.maximumZoomScale = 2.0
        webView.scrollView.zoomScale = 0.8
        
        // WKWebView를 ScrollView에 추가
        scrollView.addSubview(webView)
        
        webView.snp.makeConstraints { make in
            // 웹뷰의 크기를 스크롤 뷰보다 작게 설정하여 스크롤 가능
            make.edges.equalToSuperview()
            make.width.equalTo(view.frame.width) // 비율 줄이기
            make.height.equalTo(view.frame.height * 1.2) // 높이 증가
        }
    }
    
    private func loadSignupPage() {
        guard let url = URL(string: "http://localhost:5173/register") else {
            print("유효하지 않은 URL입니다.")
            return
        }
        let request = URLRequest(url: url)
        webView.load(request)
    }
    
//    @objc(userContentController:didReceiveScriptMessage:) func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
//        if message.name == "LoginSuccess"  {
//            self.dismiss(animated: true)
//        }
//    }
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
         // 메시지 이름이 "LoginSuccess"인지 확인
         if message.name == "LoginSuccess" {
             // 메시지 본문이 딕셔너리인지 확인
             if let dictionary = message.body as? [String: Any] {
                 // "signup" 키가 있는지 확인
                 if let action = dictionary["signup"] as? String {
                     switch action {
                     case "success":
                         // 로그인 성공 처리
                         print("회원가입 성공")
                         self.dismiss(animated: true)
                     default:
                         print("알 수 없는 액션: \(action)")
                     }
                 } else {
                     print("'signup' 키를 찾을 수 없습니다.")
                 }
             } else {
                 print("메시지 본문이 딕셔너리 형식이 아닙니다: \(message.body)")
             }
         }
     }
}

// MARK: - WKNavigationDelegate

extension SignUpViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("초기 페이지 로드 완료")
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("웹 페이지 로드 실패: \(error.localizedDescription)")
    }
}
