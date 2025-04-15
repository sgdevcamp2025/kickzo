//
//  UserOverviewReactor.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import Foundation

import ReactorKit
import RxSwift

final class UserOverviewReactor: Reactor {
    private let session = Session()
    private let networkManager = NetworkManager()
    
    enum Action {
        case loadView
        case inviteButtonTapped
        case roleButtonTapped
        case banButtonTapped
    }
    
    enum Mutation {
        case setUserInformation(UserProfileViewModel)
        case inviteUser
        case changeRole
        case banUser
    }
    
    struct State {
        var roomID: Int
        var userID: Int
        var userRole: UserRole
        var userProfile: UserProfileViewModel?
    }
    
    var initialState: State
    
    init(roomID: Int, userID: Int, role: UserRole) {
        initialState = State(roomID: roomID, userID: userID, userRole: role)
    }
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .loadView:
            return searchUser(currentState.userID)
        case .inviteButtonTapped:
            return .just(.inviteUser)
        case .roleButtonTapped:
            let newRole = currentState.userRole.rawValue == 1 ? 2 : 1
            let request = ChangeRoleRequest(roomID: currentState.roomID, targetUserID: currentState.userID, newRole: newRole)
            
            return changeRole(request)
        case .banButtonTapped:
            return .just(.banUser)
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setUserInformation(let user):
            newState.userProfile = user
        case .inviteUser:
            break
        case .changeRole:
            newState.userRole = newState.userRole == .member ? .manager : .member
        case .banUser:
            break
        }
        
        return newState
    }
    
    private func searchUser(_ id: Int) -> Observable<Mutation> {
        let userRequest = DefaultRequest<UserProfileResponseDTO>(method: .get, path: ["api", "users", "\(id)"], header: [.json, .authorizationAccessToken])
        
        return Observable.create { [weak self] observer in
            guard let self else { return Disposables.create() }
            
            Task {
                do {
                    var user = try await self.session.send(userRequest).toModel().toModel()
                    
                    if let urlString = user.profileImageURL,
                       let url = URL(string: urlString) {
                        let profileImage = try await self.networkManager.getCachingDataFromURL(url)
                        
                        user.profileImageData = profileImage
                    }
                    observer.onNext(Mutation.setUserInformation(user))
                    observer.onCompleted()
                } catch {
                    print(error)
                    observer.onCompleted()
                }
            }
            
            return Disposables.create()
        }
    }
    
    private func changeRole(_ target: ChangeRoleRequest) -> Observable<Mutation> {
        let roleRequest = DefaultRequest<String>(method: .patch, path: ["api", "rooms", "change-role"], header: [.json, .authorizationAccessToken], body: target)
        
        return Observable.create { [weak self] observer in
            guard let self else { return Disposables.create() }
            
            Task {
                do {
                    _ = try await self.session.send(roleRequest)
                    
                    observer.onNext(Mutation.changeRole)
                    observer.onCompleted()
                } catch {
                    print(error)
                    observer.onCompleted()
                }
            }
            
            return Disposables.create()
        }
    }
}
