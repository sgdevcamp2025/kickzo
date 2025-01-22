//
//  BaseViewController.swift
//  KickTube
//
//  Created by 김수경 on 1/20/25.
//

import UIKit

import ReactorKit

class BaseViewController<R: Reactor>: UIViewController, View {
    var reactor: R
    
    var disposeBag = DisposeBag()
    
    init(_ reactor: R) {
        self.reactor = reactor
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.bind(reactor: reactor)
        
        hideKeyboardWhenTappedAround()
        
        configureHierarchy()
        configureLayout()
        configureUI()
    }
    
    
    // MARK: - configure UI
    
    func configureHierarchy() {}
    
    func configureLayout() {}
    
    func configureUI() {
        view.backgroundColor = .white
    }

    func bind(reactor: R) {
        bindAction(reactor: reactor)
        bindState(reactor: reactor)
    }
    
    func bindAction(reactor: R) {}
    
    func bindState(reactor: R) {}
}
