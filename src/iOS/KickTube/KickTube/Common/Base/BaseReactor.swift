//
//  BaseReactor.swift
//  KickTube
//
//  Created by 김수경 on 1/20/25.
//

import ReactorKit

class BaseReactor: Reactor {
    struct State {}
    
    enum Action {}
    
    enum Mutation {}
    
    var initialState: State
    
    init() {
        self.initialState = State()
    }
}

extension BaseReactor {
    func mutate(action: Action) -> Observable<Mutation> {}
    
    func reduce(state: State, mutation: Mutation) -> State {}
}
