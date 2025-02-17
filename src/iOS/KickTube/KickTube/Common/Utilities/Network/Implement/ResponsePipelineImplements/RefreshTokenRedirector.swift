//
//  RefreshTokenRedirector.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import UIKit

class RefreshTokenRedirector: ResponsePipelineRedirector {
    func shouldApply<T: Request>(request: T, data: Data, response: HTTPURLResponse) -> Bool {
        return HTTPStatusCode(rawValue: response.statusCode) == .badRequest
    }
    
    func redirect<T>(request: T, data: Data, response: HTTPURLResponse) async throws -> ResponsePipelineRedirectorAction where T : Request {
        setLoginView()
        
        return .stop(NetworkError.refreshToken)
    }
    
    private func setLoginView() {
        DispatchQueue.main.async {
            let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene
            let sceneDelegate = windowScene?.delegate as? SceneDelegate
            let rootviewController = TabBarViewController()
            
            rootviewController.selectedIndex = 4
            sceneDelegate?.window?.rootViewController = rootviewController
            sceneDelegate?.window?.makeKeyAndVisible()
        }
    }
}
