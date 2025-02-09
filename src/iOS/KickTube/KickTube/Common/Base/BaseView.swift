//
//  BaseView.swift
//  KickTube
//
//  Created by 김수경 on 2/9/25.
//

import UIKit

import ReactorKit

class BaseView<R: Reactor>: UIView, View {
    var reactor: R
    
    var disposeBag = DisposeBag()
    
    init(_ reactor: R) {
        self.reactor = reactor
        
        super.init(frame: .zero)
        
        self.bind(reactor: reactor)
        
        configureHierarchy()
        configureLayout()
        configureUI()
        
        backgroundColor = .white
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    
    // MARK: - configure UI
    
    func configureHierarchy() {}
    
    func configureLayout() {}
    
    func configureUI() {}

    func bind(reactor: R) {
        bindAction(reactor: reactor)
        bindState(reactor: reactor)
    }
    
    func bindAction(reactor: R) {}
    
    func bindState(reactor: R) {}
}
