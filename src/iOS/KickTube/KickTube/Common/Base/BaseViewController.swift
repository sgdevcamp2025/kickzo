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
        
        view.backgroundColor = .white
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

extension BaseViewController {
    func changeRootViewController(_ idx: Int) {
        let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene
        let sceneDelegate = windowScene?.delegate as? SceneDelegate
        let rootviewController = TabBarViewController()
        
        rootviewController.selectedIndex = idx
        sceneDelegate?.window?.rootViewController = rootviewController
        sceneDelegate?.window?.makeKeyAndVisible()
    }
}
