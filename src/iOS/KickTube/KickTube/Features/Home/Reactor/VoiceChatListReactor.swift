//
//  VoiceChatListReactor.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import Foundation

import ReactorKit

final class VoiceChatListReactor: Reactor {
    enum Action {
        case loadView
        case profileCellTapped(idx: IndexPath)
        case micButtonTapped
        case headsetButtonTapped
        case entryButtonTapped
    }
    
    enum Mutation {
        case setUserList([KickRoomVoiceUserViewModel])
        case userOverview(_ idx: IndexPath)
        case setMicState
        case setHeadsetState
        case setEntryState
    }
    
    struct State{
        var userList: [KickRoomVoiceUserViewModel]
        var selectedCell: (id: Int, role: UserRole)?
        var myMicState: Bool = false
        var myHeadsetState: Bool = false
        var myVoiceChattingState: Bool = false
    }
    
    let initialState: State = State(
        userList: []
    )
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .loadView:
            let userlist = SampleTest.voicelist
            return .just(.setUserList(userlist))
        case .profileCellTapped(let idx):
            return .just(.userOverview(idx))
        case .micButtonTapped:
            return .just(.setMicState)
        case .headsetButtonTapped:
            return .just(.setHeadsetState)
        case .entryButtonTapped:
            return .just(.setEntryState)
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setUserList(let user):
            var userList = user
            if let myInformation = userList.enumerated().filter({ $0.element.userID == UserDefaultsManager.shared.userProfile.userID }).first {
                userList.remove(at: myInformation.offset)
                userList.insert(myInformation.element, at: 0)
                newState.myMicState = myInformation.element.micStatus
                newState.myHeadsetState = myInformation.element.headsetStatus
            }
            newState.userList = userList
        case .userOverview(let idx):
            let user = newState.userList[idx.row]
            
            newState.selectedCell = (id: user.userID, role: user.role)
        case .setMicState:
            if newState.myVoiceChattingState {
                newState.myMicState.toggle()
                newState.userList[0].micStatus = newState.myMicState
            }
        case .setHeadsetState:
            if newState.myVoiceChattingState {
                newState.myHeadsetState.toggle()
                newState.userList[0].headsetStatus = newState.myHeadsetState
            }
        case .setEntryState:
            newState.myVoiceChattingState.toggle()
            if newState.myVoiceChattingState {
                let myInfo = UserDefaultsManager.shared.userProfile
                let myState = KickRoomVoiceUserViewModel(userID: myInfo.userID, role: UserDefaultsManager.shared.myRole, nickname: myInfo.nickname, micStatus: false, headsetStatus: false)
                newState.userList.insert(myState, at: 0)
            } else {
                newState.userList.removeFirst()
                newState.myMicState = false
                newState.myHeadsetState = false
            }
        }
        
        return newState
    }
}
