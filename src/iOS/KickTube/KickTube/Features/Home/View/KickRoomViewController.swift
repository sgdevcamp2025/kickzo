//
//  KickRoomViewController.swift
//  KickTube
//
//  Created by 김수경 on 2/4/25.
//

import UIKit

import ReactorKit
import RxCocoa
import RxSwift

final class KickRoomViewController: BaseViewController<KickRoomReactor> {
    
}

final class KickRoomReactor: Reactor {
    enum Action {
        
    }
    enum Mutation {
        
    }
    struct State {
        var roomInfo: KickRoomViewModel
    }
    
    var initialState: State
    
    init(_ roomInfo: KickRoomViewModel) {
        self.initialState = State(roomInfo: roomInfo)
    }
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        
    }
}
