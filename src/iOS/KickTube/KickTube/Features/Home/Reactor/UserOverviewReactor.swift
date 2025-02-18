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
    
    enum Action {
        case loadView
        case inviteButtonTapped
        case roleButtonTapped
        case banButtonTapped
    }
    
    enum Mutation {
        case setUserInformation(UserProfileDomainModel)
        case inviteUser
        case changeRole
        case banUser
    }
    
    struct State {
        var userID: Int
        var userRole: UserRole
        var userProfile: UserProfileViewModel?
    }
    
    var initialState: State
    
    init(_ id: Int, role: UserRole) {
        initialState = State(userID: id, userRole: role)
    }
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .loadView:
            return searchUser(currentState.userID)
        case .inviteButtonTapped:
            return .just(.inviteUser)
        case .roleButtonTapped:
            // TODO: 네트워크 통신
            return .just(.changeRole)
        case .banButtonTapped:
            return .just(.banUser)
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setUserInformation(let user):
            newState.userProfile = user.toModel()
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
                    let userResponse = try await self.session.send(userRequest)
                    
                    observer.onNext(Mutation.setUserInformation(userResponse.toModel()))
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
