//
//  BaseViewController.swift
//  KickTube
//
//  Created by 김수경 on 1/20/25.
//

import UIKit

import ReactorKit

class BaseViewController<R: Reactor>: UIViewController{
    var reactor: R?
    
    var disposeBag = DisposeBag()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if let reactor {
            self.bind(reactor: reactor)
        }
        
        configureHierarchy()
        configureLayout()
        configureUI()
    }
    
    // MARK: - Configure UI
    
    func configureHierarchy() {}
    
    func configureLayout() {}
    
    func configureUI() {}
}
    
extension BaseViewController: View {
    func bind(reactor: R) {
        bindAction(reactor: reactor)
        bindState(reactor: reactor)
    }
    
    func bindAction(reactor: R) {}
    
    func bindState(reactor: R) {}
}
