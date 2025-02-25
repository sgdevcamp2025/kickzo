//
//  UserListReactor.swift
//  KickTube
//
//  Created by 김수경 on 2/9/25.
//

import Foundation

import ReactorKit

final class UserListReactor: Reactor {
    private let session = Session()
    
    enum Action {
        case loadView
        case searchText(String)
        case profileCellTapped(idx: IndexPath)
        case newUser(KickRoomUserDomainModel)
        case roleChange(KickRoomChangeUserRoleDomainModel)
    }
    
    enum Mutation {
        case setUserList
        case searchUser(String)
        case userOverview(_ idx: IndexPath)
        case addUser(KickRoomUserViewModel)
        case changeUserRole(KickRoomChangeUserRoleViewModel)
    }
    
    struct State {
        var roomID: Int?
        var userList: [KickRoomUserViewModel]
        var aliveUserSet: Set<Int> = []
        var searchUserResult: [KickRoomUserViewModel] = []
        var selectedCell: (id: Int, role: UserRole)?
    }
    
    let initialState: State
    private var disposeBag = DisposeBag()
    
    init(roomID: Int?, _ user: [KickRoomUserViewModel]?) {
        self.initialState = State(
            roomID: roomID,
            userList: user ?? []
        )
        
        WebSocketService.shared.newUserObservable
            .subscribe(onNext: { [weak self] user in
                self?.action.onNext(.newUser(user.toModel()))
            })
            .disposed(by: disposeBag)
        WebSocketService.shared.roleChangeObservable
            .subscribe(onNext: { [weak self] user in
                self?.action.onNext(.roleChange(user.toModel()))
            })
            .disposed(by: disposeBag)
    }
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .loadView:
            return .just(.setUserList)
        case .searchText(let text):
            return .just(.searchUser(text))
        case .profileCellTapped(let idx):
            return .just(.userOverview(idx))
        case .newUser(let user):
            return .just(.addUser(user.toModel()))
        case .roleChange(let user):
            return .just(.changeUserRole(user.toModel()))
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setUserList:
            newState.aliveUserSet = Set(newState.userList.map { $0.userID })
            newState.userList = sortUserList(newState.userList)
            newState.searchUserResult = newState.userList
        case .searchUser(let text):
            if text == "" {
                newState.searchUserResult = newState.userList
            } else {
                let result = newState.userList.filter { $0.nickname.contains(text) }
                
                newState.searchUserResult = result
            }
            newState.selectedCell = nil
        case .userOverview(let idx):
            var user: KickRoomUserViewModel
            
            user = newState.searchUserResult[idx.row]
            newState.selectedCell = (id: user.userID, role: user.role)
        case .addUser(let user):
            newState.userList.append(user)
            newState.searchUserResult.append(user)
        case .changeUserRole(let user):
            if newState.aliveUserSet.contains(user.targetUserID) {
                if let uIdx = newState.userList.firstIndex(where: { $0.userID == user.targetUserID }) {
                    newState.userList[uIdx].role = user.newRole
                }
                if let sIdx = newState.searchUserResult.firstIndex(where: { $0.userID == user.targetUserID }) {
                    newState.searchUserResult[sIdx].role = user.newRole
                }
                newState.userList = sortUserList(newState.userList)
                newState.searchUserResult = sortUserList(newState.searchUserResult)
            }
        }
        
        return newState
    }
    
    private func sortUserList(_ list: [KickRoomUserViewModel]) -> [KickRoomUserViewModel] {
        var userList = list
        
        userList = userList.sorted { $0.role.rawValue < $1.role.rawValue }
        if let myInformation = userList.enumerated().filter({ $0.element.userID == UserDefaultsManager.shared.myProfile.userID }).first {
            userList.remove(at: myInformation.offset)
            userList.insert(myInformation.element, at: 0)
        }
        
        return userList
    }
}
