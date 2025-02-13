//
//  UserOverviewViewController.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import UIKit

import ReactorKit
import RxSwift
import RxCocoa

final class UserOverviewViewController: BaseViewController<UserOverviewReactor> {
    private let thumbnailView = UIImageView().then {
        $0.layer.cornerRadius = 8
        $0.backgroundColor = .kDarkgray
    }
    private let inviteButton = UIButton().then {
        $0.setImage(.invite, for: .normal)
        $0.backgroundColor = .kLightgray1
        $0.imageView?.contentMode = .scaleToFill
        $0.clipsToBounds = true
        $0.layer.cornerRadius = 15
    }
    private let nameLabel = UILabel().then {
        $0.font = KFont.bold18
    }
    private let descriptionLabel = UILabel().then {
        $0.font = KFont.middle14
        $0.numberOfLines = 3
    }
    private lazy var roleButton = RoleButton(reactor.initialState.userRole).then {
        $0.isUserInteractionEnabled = false
    }
    private let banButton = RedButton("추방하기").then {
        $0.isUserInteractionEnabled = false
    }
    
    
    // MARK: - bind reactor
    
    override func bindAction(reactor: UserOverviewReactor) {
        Observable.just(UserOverviewReactor.Action.loadView)
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        roleButton.rx.tap
            .map { UserOverviewReactor.Action.roleButtonTapped }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
    }
    
    override func bindState(reactor: UserOverviewReactor) {
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
            .map { $0.userRole }
            .subscribe(with: self) { owner, value in
                owner.roleButton.setRole(value)
            }
            .disposed(by: disposeBag)
    }
    
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        [thumbnailView, inviteButton, nameLabel, descriptionLabel, banButton, roleButton].forEach {
            view.addSubview($0)
        }
    }
    
    override func configureLayout() {
        thumbnailView.snp.makeConstraints { make in
            make.top.leading.equalToSuperview().inset(20)
            make.size.equalTo(ComponentSize.userOverviewProfileImage.size)
        }
        inviteButton.snp.makeConstraints { make in
            make.top.trailing.equalToSuperview().inset(20)
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
            make.bottom.equalToSuperview().offset(-12)
            make.horizontalEdges.equalToSuperview().inset(20)
            make.height.equalTo(ComponentSize.optionButton.size.height)
        }
        roleButton.snp.makeConstraints { make in
            make.bottom.equalTo(banButton.snp.top).offset(-8)
            make.horizontalEdges.equalToSuperview().inset(20)
            make.height.equalTo(ComponentSize.optionButton.size.height)
        }
    }
    
    override func configureUI() {
        if UserDefaultsManager.shared.myRole == .creator {
            roleButton.isUserInteractionEnabled = true
            banButton.isUserInteractionEnabled = true
        }
    }
}
