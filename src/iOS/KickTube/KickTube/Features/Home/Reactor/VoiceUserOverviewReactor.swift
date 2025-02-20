//
//  VoiceUserOverviewReactor.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import Foundation

import ReactorKit
import RxSwift

final class VoiceUserOverviewReactor: Reactor {
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
        var voiceState: VoiceChatUserStateViewModel
        var userProfile: UserProfileViewModel?
    }
    
    var initialState: State
    
    init(_ voice: VoiceChatUserStateViewModel) {
        initialState = State(voiceState: voice)
    }
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .loadView:
            // TODO: 네트워크 통신
//            let data = SampleTest.overviewuserlist.toModel()
//            let thumbnailData = Data()
//            data.profileImageData = thumbnailData
//            return .just(.setUserInformation(data))
            return .empty()
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
            newState.userProfile = user
        case .inviteUser:
            break
        case .changeRole:
            newState.voiceState.role = newState.voiceState.role == .member ? .manager : .member
        case .banUser:
            break
        }
        
        return newState
    }
}
