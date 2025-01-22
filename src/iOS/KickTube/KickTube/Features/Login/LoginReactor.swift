//
//  LoginReactor.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

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
        case setUserInformation
    }
    
    struct State {
        var isIDSave: Bool
        var loginInformation: LoginViewModel
        var loginResponse: Void
    }
    
    let initialState = State(
        isIDSave: false,
        loginInformation: LoginViewModel(),
        loginResponse: ()
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
            // 네트워크 작업 수행 및 결과를 reduce로 전달
            return .just(Mutation.setUserInformation)
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .toggleSaveIDCheck:
            newState.isIDSave.toggle()
        case .setID(let id):
            newState.loginInformation.id = id
        case .setPW(let pw):
            newState.loginInformation.pw = pw
        case .setUserInformation:
            // user 정보 가공 및 저장
            break
        }
        
        return newState
    }
}
