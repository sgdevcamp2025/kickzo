//
//  VoiceUserOverviewViewController.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import UIKit

import ReactorKit
import RxSwift
import RxCocoa

final class VoiceUserOverviewViewController: BaseViewController<VoiceUserOverviewReactor> {
    private let thumbnailView = UIImageView().then {
        $0.layer.cornerRadius = 8
        $0.backgroundColor = .kDarkgray
    }
    private let micButton = UIButton().then {
        $0.backgroundColor = .kLightgray1
        $0.imageView?.contentMode = .scaleToFill
        $0.clipsToBounds = true
        $0.layer.cornerRadius = 20
        $0.isUserInteractionEnabled = false
    }
    private let headsetButton = UIButton().then {
        $0.backgroundColor = .kLightgray1
        $0.imageView?.contentMode = .scaleToFill
        $0.clipsToBounds = true
        $0.layer.cornerRadius = 20
        $0.isUserInteractionEnabled = false
    }
    private let nameLabel = UILabel().then {
        $0.font = KFont.bold18
    }
    private let descriptionLabel = UILabel().then {
        $0.font = KFont.middle14
        $0.numberOfLines = 3
    }
    private lazy var roleButton = RoleButton(reactor.initialState.voiceState.role).then {
        $0.isUserInteractionEnabled = false
    }
    private let hangupButton = RedButton("연결끊기").then {
        $0.isUserInteractionEnabled = false
    }
    private let banButton = RedButton("추방하기").then {
        $0.isUserInteractionEnabled = false
    }
    
    
    // MARK: - bind reactor
    
    override func bindAction(reactor: VoiceUserOverviewReactor) {
        Observable.just(VoiceUserOverviewReactor.Action.loadView)
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        roleButton.rx.tap
            .map { VoiceUserOverviewReactor.Action.roleButtonTapped }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
    }

    override func bindState(reactor: VoiceUserOverviewReactor) {
        reactor.state
            .map { $0.userProfile }
            .compactMap { $0 }
            .subscribe(with: self) { owner, value in
//                thumbnailView.image = value.profileImageData
                owner.nameLabel.text = value.nickname
                owner.descriptionLabel.text = value.stateMessage
            }
            .disposed(by: disposeBag)
        reactor.state
            .map { $0.voiceState }
            .observe(on: MainScheduler.instance)
            .subscribe(with: self) { owner, value in
                owner.roleButton.setRole(value.role)
                owner.micButton.setImage(value.micOn ? .micOn : .micOff , for: .normal)
                owner.headsetButton.setImage(value.headsetOn ? .headsetOn : .headsetOff , for: .normal)
            }
            .disposed(by: disposeBag)
    }
    
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        [thumbnailView, micButton, headsetButton, nameLabel, descriptionLabel, banButton, hangupButton, roleButton].forEach {
            view.addSubview($0)
        }
    }
    
    override func configureLayout() {
        let safeArea = view.safeAreaLayoutGuide
        
        thumbnailView.snp.makeConstraints { make in
            make.top.leading.equalTo(safeArea).inset(20)
            make.size.equalTo(ComponentSize.userOverviewProfileImage.size)
        }
        headsetButton.snp.makeConstraints { make in
            make.top.trailing.equalTo(safeArea).inset(20)
            make.size.equalTo(CGSize(width: 40, height: 40))
        }
        micButton.snp.makeConstraints { make in
            make.top.equalTo(safeArea).offset(20)
            make.trailing.equalTo(headsetButton.snp.leading).offset(-12)
            make.size.equalTo(CGSize(width: 40, height: 40))
        }
        nameLabel.snp.makeConstraints { make in
            make.bottom.equalTo(thumbnailView.snp.bottom).offset(-8)
            make.leading.equalTo(thumbnailView.snp.trailing).offset(12)
        }
        descriptionLabel.snp.makeConstraints { make in
            make.top.equalTo(thumbnailView.snp.bottom).offset(8)
            make.leading.equalToSuperview().offset(22)
        }
        banButton.snp.makeConstraints { make in
            make.bottom.equalTo(safeArea).offset(-12)
            make.horizontalEdges.equalToSuperview().inset(20)
            make.height.equalTo(ComponentSize.optionButton.size.height)
        }
        hangupButton.snp.makeConstraints { make in
            make.bottom.equalTo(banButton.snp.top).offset(-8)
            make.horizontalEdges.equalToSuperview().inset(20)
            make.height.equalTo(ComponentSize.optionButton.size.height)
        }
        roleButton.snp.makeConstraints { make in
            make.bottom.equalTo(hangupButton.snp.top).offset(-8)
            make.horizontalEdges.equalToSuperview().inset(20)
            make.height.equalTo(ComponentSize.optionButton.size.height)
        }
    }
    
    // TODO: creator, 나인 경우에도
    override func configureUI() {
        if UserDefaultsManager.shared.myRole == .creator {
            roleButton.isUserInteractionEnabled = true
            banButton.isUserInteractionEnabled = true
            micButton.isUserInteractionEnabled = true
            headsetButton.isUserInteractionEnabled = true
        }
    }
}
