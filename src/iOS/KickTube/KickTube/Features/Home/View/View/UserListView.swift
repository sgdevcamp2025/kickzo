//
//  UserListView.swift
//  KickTube
//
//  Created by 김수경 on 2/9/25.
//

import UIKit

import ReactorKit
import RxSwift
import RxCocoa

final class UserListView: BaseView<UserListReactor> {
    private let backgroundView = UIView().then {
        $0.clipsToBounds = true
    }
    private let inviteButton = UIButton().then {
        $0.setImage(.invite, for: .normal)
        $0.contentVerticalAlignment = .fill
        $0.contentHorizontalAlignment = .fill
    }
    private let searchRoomUserTextField = LightStrokeTextField().then {
        $0.layer.cornerRadius = 0
        $0.backgroundColor = .white
        $0.textfield.placeholder = "현재 참여하고 있는 유저를 검색해보세요."
    }
    private let userlistCollectionView = UICollectionView(frame: .zero, collectionViewLayout: .userCollectionViewLayout()).then {
        $0.register(UserListCollectionViewCell.self, forCellWithReuseIdentifier: UserListCollectionViewCell.reuseIdentifier)
        $0.showsVerticalScrollIndicator = false
        $0.showsHorizontalScrollIndicator = false
    }

    
    // MARK: - configure reactor

    override func bindAction(reactor: UserListReactor) {
        Observable.just(UserListReactor.Action.loadView)
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        searchRoomUserTextField.textfield.rx.text
            .orEmpty
            .distinctUntilChanged()
            .map { Reactor.Action.searchText($0) }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        userlistCollectionView.rx.itemSelected
            .distinctUntilChanged()
            .map { Reactor.Action.profileCellTapped(idx: $0) }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
    }
    
    override func bindState(reactor: UserListReactor) {
        reactor.state
            .map { $0.searchUserResult }
            .asDriver(onErrorJustReturn: [])
            .drive(userlistCollectionView.rx.items(cellIdentifier: UserListCollectionViewCell.reuseIdentifier, cellType: UserListCollectionViewCell.self)) { (item, element, cell) in
                cell.setContent(element)
            }
            .disposed(by: disposeBag)
        reactor.state
            .map { $0.selectedCell }
            .compactMap { $0 }
            .subscribe(with: self) { owner, value in
                NotificationCenter.default.post(name: .presentUserOverview, object: nil, userInfo: ["id": value.id, "role": value.role])
            }
            .disposed(by: disposeBag)
    }
    
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        addSubview(backgroundView)
        [inviteButton, searchRoomUserTextField, userlistCollectionView].forEach {
            backgroundView.addSubview($0)
        }
    }
    
    override func configureLayout() {
        backgroundView.snp.makeConstraints { make in
            make.edges.equalToSuperview().inset(12)
        }
        searchRoomUserTextField.snp.makeConstraints { make in
            make.top.trailing.equalToSuperview()
            make.leading.equalTo(inviteButton.snp.trailing).offset(12)
        }
        inviteButton.snp.makeConstraints { make in
            make.leading.equalToSuperview().offset(12)
            make.centerY.equalTo(searchRoomUserTextField)
            make.size.equalTo(20)
        }
        userlistCollectionView.snp.makeConstraints { make in
            make.top.equalTo(searchRoomUserTextField.snp.bottom).offset(8)
            make.horizontalEdges.equalToSuperview().inset(8)
            make.bottom.equalToSuperview().offset(-8)
        }
    }
    
    override func configureUI() {
        backgroundView.layer.cornerRadius = 8
        backgroundView.layer.borderWidth = 1
        backgroundView.layer.borderColor = UIColor.kGray.cgColor
    }
}
