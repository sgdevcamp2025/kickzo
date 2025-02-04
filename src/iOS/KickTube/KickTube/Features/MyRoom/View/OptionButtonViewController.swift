//
//  OptionButtonViewController.swift
//  KickTube
//
//  Created by 김수경 on 2/3/25.
//

import UIKit

import ReactorKit
import RxCocoa
import RxSwift

final class OptionButtonViewController: BaseViewController<OptionButtonReactor> {
    private let popupView = UIView().then {
        $0.backgroundColor = .primary
        $0.layer.cornerRadius = ComponentSize.optionButton.radius
    }
    private let iconImageView = UIImageView().then {
        $0.tintColor = .white
    }
    private let titleLabel = UILabel().then {
        $0.font = KFont.bold18
        $0.textColor = .white
        $0.numberOfLines = 10
    }
    
    private let option: MyRoomOption
    
    weak var delegate: MyRoomViewController?
   
    init(option: MyRoomOption, reactor: OptionButtonReactor) {
        self.option = option
        super.init(reactor)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        configureHierarchy()
        configureLayout()
        configureUI()
    }
    

    // MARK: - button method
    
    @objc
    private func setAcceptButton() {
        switch option {
        case .deleteCreatedRoom:
            Observable.just(OptionButtonReactor.Action.deleteButtonTapped)
                .bind(to: reactor.action)
                .disposed(by: disposeBag)
        case .leaveParticipatedRoom:
            Observable.just(OptionButtonReactor.Action.leaveButtonTapped)
                .bind(to: reactor.action)
                .disposed(by: disposeBag)
        }
    }
    
    override func bindState(reactor: OptionButtonReactor) {
        reactor.state
            .map { $0.deleteResult }
            .distinctUntilChanged()
            .subscribe(with: self, onNext: { owner, value in
                owner.dismiss(animated: false)
                
                if let result = value {
                    let idx = reactor.initialState.indexPath
                    owner.delegate?.deleteRoom(idx: idx, result: result)
                }
            })
            .disposed(by: disposeBag)
        reactor.state
            .map { $0.leaveResult }
            .distinctUntilChanged()
            .subscribe(with: self, onNext: { owner, value in
                owner.dismiss(animated: false)
                
                if let result = value {
                    let idx = reactor.initialState.indexPath
                    owner.delegate?.leaveRoom(idx: idx, result: result)
                }
            })
            .disposed(by: disposeBag)
    }

    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        view.addSubview(popupView)
        [iconImageView, titleLabel].forEach {
            popupView.addSubview($0)
        }
    }
    
    override func configureLayout() {
        let safeArea = view.safeAreaLayoutGuide
        
        popupView.snp.makeConstraints { make in
            make.bottom.equalTo(safeArea).offset(-12)
            make.centerX.equalToSuperview()
            make.size.equalTo(ComponentSize.optionButton.size)
        }
        iconImageView.snp.makeConstraints { make in
            make.centerY.equalToSuperview()
            make.leading.equalToSuperview().offset(24)
            make.size.equalTo(24)
        }
        titleLabel.snp.makeConstraints { make in
            make.centerY.equalTo(iconImageView.snp.centerY)
            make.leading.equalTo(iconImageView.snp.trailing).offset(12)
            make.trailing.equalToSuperview().offset(-12)
        }
    }
    
    override func configureUI() {
        view.backgroundColor = UIColor.black.withAlphaComponent(0.5)
        
        iconImageView.image = option.info.image
        titleLabel.text = option.info.title
        
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(setAcceptButton))
        popupView.addGestureRecognizer(tapGesture)
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        if let touch = touches.first {
            let location = touch.location(in: view)
            let popupView = view.subviews.first { $0 != self.view }
            if let popupView = popupView, !popupView.frame.contains(location) {
                dismiss(animated: true, completion: nil)
            }
        }
    }
}
