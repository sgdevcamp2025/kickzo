//
//  CreateRoomViewController.swift
//  KickTube
//
//  Created by 김수경 on 1/31/25.
//

import UIKit

import ReactorKit
import RxCocoa
import RxSwift

final class CreateRoomViewController: BaseViewController<CreateRoomReactor> {
    private let popupView = UIView().then {
        $0.backgroundColor = .white
        $0.layer.cornerRadius = 10
    }
    private let logoImageView = UIImageView().then {
        $0.image = UIImage.play
    }
    private let titleLabel = UILabel().then {
        $0.text = "방 만들기"
        $0.font = KFont.bold20
        $0.textColor = .kDarkgray
    }
    private let titleTextField = LightStrokeTextField(maxLength: 50).then {
        $0.setPlacehodler("방 제목 (필수)")
        $0.setStyle(.kLightgray1, strokeColor: .kLightgray2)
    }
    private let titleLimitLabel = UILabel().then {
        $0.text = "0/50"
        $0.font = KFont.middle12
        $0.textColor = .kGray
    }
    private let descriptionTextField = LightStrokeTextView(maxLength: 200).then {
        $0.setPlaceholder("방 설명 (선택)")
    }
    private let descriptionLimitLabel = UILabel().then {
        $0.text = "0/200"
        $0.font = KFont.middle10
        $0.textColor = .kGray
    }
    private let publicStatusStack = UIStackView().then {
        $0.axis = .horizontal
        $0.distribution = .fillEqually
        $0.spacing = 6
    }
    private let publicButton = RoundButton("공개", image: .friend, bgColor: .kDarkgray, titleColor: .white, toggleBackgroundColor: .white, toggleTitleColor: .kDarkgray)
    private let privateButton = RoundButton("비공개", image: .disableEye, bgColor: .white, titleColor: .kDarkgray, toggleBackgroundColor: .kDarkgray, toggleTitleColor: .white).then {
        $0.setStroke(.kLightgray2)
    }
    private let createButton = RoundButton("생성")
    private let cancelButton = RoundButton("취소", bgColor: .white, titleColor: .primary).then {
        $0.setStroke(.kLightgray2)
    }
    
    
    // MARK: - configure Reactor
    
    override func bindAction(reactor: CreateRoomReactor) {
        titleTextField.textfield.rx.text
            .map { Reactor.Action.writeTitle($0) }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        descriptionTextField.textView.rx.text
            .map { Reactor.Action.writeDescription($0) }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        publicButton.rx.tap
            .map { Reactor.Action.publicButtonTapped }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        privateButton.rx.tap
            .map { Reactor.Action.privateButtonTapped }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
    }
    
    override func bindState(reactor: CreateRoomReactor) {
        reactor.state
            .map { $0.title ?? "" }
            .asDriver(onErrorJustReturn: "")
            .drive(with: self) { owner, value in
                owner.titleLimitLabel.text = "\(value.count) / 50"
            }
            .disposed(by: disposeBag)
        reactor.state
            .map { $0.description ?? "" }
            .asDriver(onErrorJustReturn: "")
            .drive(with: self) { owner, value in
                owner.descriptionLimitLabel.text = "\(value.count) / 200"
            }
            .disposed(by: disposeBag)
        reactor.state
            .map { $0.publicRoomMode }
            .distinctUntilChanged()
            .asDriver(onErrorJustReturn: true)
            .drive(with: self) { owner, value in
                owner.togglepublicStatus(value)
            }
            .disposed(by: disposeBag)
    }
    
    
    // MARK: - private method
    
    private func togglepublicStatus(_ isPublic: Bool) {
        publicButton.toggleButtonStatus(isPublic)
        privateButton.toggleButtonStatus(isPublic)
    }
    
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        view.addSubview(popupView)
        [logoImageView, titleLabel, titleTextField, titleLimitLabel, descriptionTextField, descriptionLimitLabel, cancelButton, createButton, publicStatusStack].forEach {
            popupView.addSubview($0)
        }
        [publicButton, privateButton].forEach {
            publicStatusStack.addArrangedSubview($0)
        }
    }
    
    override func configureLayout() {
        popupView.snp.makeConstraints { make in
            make.center.equalToSuperview()
            make.size.equalTo(ComponentSize.createRoomModal.size)
        }
        logoImageView.snp.makeConstraints { make in
            make.top.leading.equalToSuperview().inset(20)
            make.size.equalTo(24)
        }
        titleLabel.snp.makeConstraints { make in
            make.top.equalTo(logoImageView.snp.top)
            make.leading.equalTo(logoImageView.snp.trailing).offset(10)
        }
        titleTextField.snp.makeConstraints { make in
            make.top.equalTo(logoImageView.snp.bottom).offset(20)
            make.horizontalEdges.equalToSuperview().inset(20)
        }
        titleLimitLabel.snp.makeConstraints { make in
            make.top.equalTo(titleTextField.snp.bottom).offset(4)
            make.trailing.equalTo(titleTextField.snp.trailing).inset(4)
        }
        descriptionTextField.snp.makeConstraints { make in
            make.top.equalTo(titleLimitLabel.snp.bottom).offset(10)
            make.horizontalEdges.equalToSuperview().inset(20)
            make.height.equalTo(titleTextField.snp.height).multipliedBy(3)
        }
        descriptionLimitLabel.snp.makeConstraints { make in
            make.top.equalTo(descriptionTextField.snp.bottom).offset(4)
            make.trailing.equalTo(descriptionTextField.snp.trailing).inset(4)
        }
        cancelButton.snp.makeConstraints { make in
            make.bottom.equalToSuperview().inset(20)
            make.horizontalEdges.equalToSuperview().inset(20)
            make.height.equalTo(39)
        }
        createButton.snp.makeConstraints { make in
            make.bottom.equalTo(cancelButton.snp.top).offset(-16)
            make.horizontalEdges.equalToSuperview().inset(20)
            make.height.equalTo(39)
        }
        publicStatusStack.snp.makeConstraints { make in
            make.bottom.equalTo(createButton.snp.top).offset(-20)
            make.horizontalEdges.equalToSuperview().inset(20)
            make.height.equalTo(39)
        }
    }
    
    override func configureUI() {
        view.backgroundColor = UIColor.black.withAlphaComponent(0.5)
        
        cancelButton.addTarget(self, action: #selector(dismissPopup), for: .touchUpInside)
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
    
    @objc
    private func dismissPopup() {
        dismiss(animated: false, completion: nil)
    }
}
