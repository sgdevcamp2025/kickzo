//
//  VoiceChatListView.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import UIKit

import ReactorKit
import RxSwift
import RxCocoa

final class VoiceChatListView: BaseView<VoiceChatListReactor> {
    private let backgroundView = UIView().then {
        $0.clipsToBounds = true
    }
    private let userlistCollectionView = UICollectionView(frame: .zero, collectionViewLayout: .userCollectionViewLayout()).then {
        $0.register(VoiceChatUserListCollectionViewCell.self, forCellWithReuseIdentifier: VoiceChatUserListCollectionViewCell.reuseIdentifier)
        $0.showsVerticalScrollIndicator = false
        $0.showsHorizontalScrollIndicator = false
    }
    private let voiceStackView = UIStackView().then {
        $0.axis = .horizontal
        $0.distribution = .fillProportionally
        $0.spacing = 12
    }
    private let micButton = UIButton().then {
        $0.layer.cornerRadius = 20
        $0.backgroundColor = .kLightgray1
    }
    private let headsetButton = UIButton().then {
        $0.layer.cornerRadius = 20
        $0.backgroundColor = .kLightgray1
    }
    private let entryButton = RoundButton("입장", bgColor: .primary, titleColor: .white, toggleBgColor: .kDarkgray, toggleTitleColor: .white)
    
    
    // MARK: - initializer
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    
    // MARK: - configure reactor

    override func bindAction(reactor: VoiceChatListReactor) {
        Observable.just(VoiceChatListReactor.Action.loadView)
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        userlistCollectionView.rx.itemSelected
            .map { Reactor.Action.profileCellTapped(idx: $0) }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        micButton.rx.tap
            .map { Reactor.Action.micButtonTapped }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        headsetButton.rx.tap
            .map { Reactor.Action.headsetButtonTapped }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        entryButton.rx.tap
            .map { Reactor.Action.entryButtonTapped }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
    }
    
    override func bindState(reactor: VoiceChatListReactor) {
        reactor.state
            .map { $0.userList }
            .asDriver(onErrorJustReturn: [])
            .drive(userlistCollectionView.rx.items(cellIdentifier: VoiceChatUserListCollectionViewCell.reuseIdentifier, cellType: VoiceChatUserListCollectionViewCell.self)) { (item, element, cell) in
                cell.setContent(element)
            }
            .disposed(by: disposeBag)
        reactor.state
            .map { $0.selectedCell }
            .compactMap { $0 }
            .subscribe(on: MainScheduler.instance)
            .subscribe(with: self) { owner, value in
                NotificationCenter.default.post(name: .presentVoiceUserOverview, object: nil, userInfo: ["voiceState": value])
            }
            .disposed(by: disposeBag)
        reactor.state
            .map { $0.myMicState }
            .distinctUntilChanged { _, _ in false }
            .subscribe(on: MainScheduler.instance)
            .subscribe(with: self) { owner, value in
                if value {
                    owner.micButton.setImage(.micOn, for: .normal)
                } else {
                    owner.micButton.setImage(.micOff.withTintColor(.red), for: .normal)
                }
            }
            .disposed(by: disposeBag)
        reactor.state
            .map { $0.myHeadsetState }
            .distinctUntilChanged()
            .subscribe(on: MainScheduler.instance)
            .subscribe(with: self) { owner, value in
                if value {
                    owner.headsetButton.setImage(.headsetOn, for: .normal)
                } else {
                    owner.headsetButton.setImage(.headsetOff.withTintColor(.red), for: .normal)
                }
            }
            .disposed(by: disposeBag)
        reactor.state
            .map { $0.myVoiceChattingState }
            .distinctUntilChanged()
            .subscribe(on: MainScheduler.instance)
            .subscribe(with: self) { owner, value in
                if value {
                    owner.entryButton.setTitle("나가기")
                } else {
                    owner.entryButton.setTitle("입장")
                }
                owner.entryButton.toggleButtonStatus(!value)
            }
            .disposed(by: disposeBag)
    }
    
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        addSubview(backgroundView)
        [userlistCollectionView, voiceStackView].forEach {
            backgroundView.addSubview($0)
        }
        [micButton, headsetButton, entryButton].forEach {
            voiceStackView.addArrangedSubview($0)
        }
    }
    
    override func configureLayout() {
        backgroundView.snp.makeConstraints { make in
            make.edges.equalToSuperview().inset(12)
        }
        voiceStackView.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(8)
            make.horizontalEdges.equalToSuperview().inset(8)
            make.height.equalTo(40)
        }
        userlistCollectionView.snp.makeConstraints { make in
            make.horizontalEdges.bottom.equalToSuperview().inset(8)
            make.top.equalTo(voiceStackView.snp.bottom)
        }
        micButton.snp.makeConstraints { make in
            make.size.equalTo(CGSize(width: 40, height: 40))
        }
        headsetButton.snp.makeConstraints { make in
            make.size.equalTo(CGSize(width: 40, height: 40))
        }
    }
    
    override func configureUI() {
        backgroundView.layer.cornerRadius = 8
        backgroundView.layer.borderWidth = 1
        backgroundView.layer.borderColor = UIColor.kGray.cgColor
    }
}
