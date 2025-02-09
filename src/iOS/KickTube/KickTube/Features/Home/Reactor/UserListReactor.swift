//
//  UserListReactor.swift
//  KickTube
//
//  Created by 김수경 on 2/9/25.
//

import Foundation

import ReactorKit

final class UserListReactor: Reactor {
    
    enum Action {
        case loadView
        case searchText(String)
    }
    
    enum Mutation {
        case setUserList
        case searchUser(String)
    }
    
    struct State{
        var userList: [KickRoomUserViewModel]
        var searchUserResult: [KickRoomUserViewModel] = []
    }
    
    let initialState: State
    
    init(_ user: [KickRoomUserViewModel]) {
        self.initialState = State(
            userList: user
        )
    }
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .loadView:
            return .just(.setUserList)
        case .searchText(let text):
            return .just(.searchUser(text))
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setUserList:
            if let myInformation = newState.userList.enumerated().filter({ $0.element.userID == UserDefaultsManager.shared.userProfile.userID }).first {
                newState.userList.remove(at: myInformation.offset)
                newState.userList.insert(myInformation.element, at: 0)
            }
            newState.searchUserResult = newState.userList
        case .searchUser(let text):
            if text == "" {
                newState.searchUserResult = newState.userList
            } else {
                let result = newState.userList.filter { $0.nickname.contains(text) }
                
                newState.searchUserResult = result
            }
        }
        
        return newState
    }
}
