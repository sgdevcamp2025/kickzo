//
//  LoginReactor.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import UIKit

import ReactorKit

final class LoginReactor: Reactor {
    private let session = Session()
    
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
        case setMyProfile(UserProfileDomainModel)
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
            
        case .setMyProfile(let data):
            var loginData = data.toModel()
            
            loginData.profileImageData = UIImage.defaultProfile.toData()
            UserDefaultsManager.shared.myProfile = loginData
            
            newState.loginResponse = true
        }
        
        return newState
    }
    
    // MARK: - private method
    
    private func login(_ login: LoginViewModel) -> Observable<Mutation> {
      let request = LoginRequest(
            method: .post, path: ["api", "auth", "login"],
            header: [.json, .login(currentState.loginInformation)],
            body: LoginRequestDTO()
        )
        
        return Observable.create { [weak self] observer in
            guard let self else { return Disposables.create() }
            
            Task {
                do {
                    let loginResponse = try await self.session.send(request)
                    
                    observer.onNext(Mutation.setUserInformation(loginResponse.toModel()))
                    
                    let myProfileRequest = API.User.myProfile
                    let myProfileResponse = try await self.session.send(myProfileRequest)
                    
                    observer.onNext(Mutation.setMyProfile(myProfileResponse.toModel()))
                    observer.onCompleted()
                } catch {
                    observer.onCompleted()
                }
            }
            return Disposables.create()
        }
    }
}
