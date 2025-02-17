//
//  LoginReactor.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import Foundation

import ReactorKit

final class LoginReactor: Reactor {
    enum Action {
        case saveIDButtonTap
        case setIDText(String)
        case setPWText(String)
        case loginButtonTap
    }
    
    enum Mutation {
        case toggleSaveIDCheck
        case setID(String)
        case setPW(String)
        case setUserInformation(TokenDomainModel)
    }
    
    struct State {
        var isIDSave: Bool
        var loginInformation: LoginViewModel
        var loginResponse: Bool
    }
    
    let initialState = State(
        isIDSave: false,
        loginInformation: LoginViewModel(userID: "", password: ""),
        loginResponse: false
    )
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .saveIDButtonTap:
            return .just(Mutation.toggleSaveIDCheck)
        case .setIDText(let id):
            return .just(Mutation.setID(id))
        case .setPWText(let pw):
            return .just(Mutation.setPW(pw))
        case .loginButtonTap:
            if !currentState.loginInformation.isEmpty {
                return login(currentState.loginInformation)
            }
            
            return .empty()
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .toggleSaveIDCheck:
            newState.isIDSave.toggle()
        case .setID(let id):
            newState.loginInformation.userID = id
        case .setPW(let pw):
            newState.loginInformation.password = pw
        case .setUserInformation(let data):
            KeyChainManager.shared.save(key: .accessToken, value: data.accessToken)
            KeyChainManager.shared.save(key: .refreshToken, value: data.refreshToken)
            
            newState.loginResponse = true
        }
        
        return newState
    }
    
    // MARK: - private method
    
    private func login(_ login: LoginViewModel) -> Observable<Mutation> {
        struct LoginRequestBody: Encodable {
            let device: String = "mobile"
        }
        
        let request = LoginRequest(
            method: .post, path: ["api", "auth", "login"],
            header: [.json, .login(currentState.loginInformation)],
            body: LoginRequestBody()
        )
        
        return Observable.create { observer in
            Task {
                do {
                    let response = try await Session().send(request)
                    
                    observer.onNext(Mutation.setUserInformation(response.toModel()))
                    observer.onCompleted()
                } catch {
                    observer.onCompleted()
                }
            }
            return Disposables.create()
        }
    }
}
