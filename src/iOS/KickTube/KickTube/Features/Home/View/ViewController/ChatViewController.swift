//
//  ChatViewController.swift
//  KickTube
//
//  Created by 김수경 on 2/11/25.
//

import UIKit

import ReactorKit
import RxCocoa
import RxDataSources
import RxSwift

final class ChatViewController: BaseViewController<ChatReactor> {
    private lazy var chatCollectionView = UICollectionView(frame: .zero, collectionViewLayout: .chatCollectionViewLayout()).then {
        $0.register(ChatCollectionViewCell.self, forCellWithReuseIdentifier: ChatCollectionViewCell.reuseIdentifier)
    }
    private let fileAddButton = UIButton().then {
        $0.setImage(.create, for: .normal)
        $0.tintColor = .kGray
        $0.contentVerticalAlignment = .fill
        $0.contentHorizontalAlignment = .fill
    }
    private let messageTextView = LightStrokeTextView().then {
        $0.setPlaceholder("채팅 보내기")
    }
    
    
    // MARK: - configure reactor
    
    override func bindAction(reactor: ChatReactor) {
        reactor.action.onNext(.getSavedMessage)
        
        messageTextView.textView.rx.text
            .orEmpty
            .distinctUntilChanged()
            .subscribe(with: self) { owner, value in
                let trimmedText = value.trimmingCharacters(in: .whitespacesAndNewlines)
                
                if value.last == "\n" && !trimmedText.isEmpty {
                    reactor.action.onNext(.sendMessage(value))
                    owner.messageTextView.textView.rx.text.onNext("")
                }
            }
            .disposed(by: disposeBag)
        
    }
    
    override func bindState(reactor: ChatReactor) {
    }
    
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        [chatCollectionView, fileAddButton, messageTextView].forEach {
            view.addSubview($0)
        }
    }
    
    override func configureLayout() {
        let safeArea = view.safeAreaLayoutGuide
        
        chatCollectionView.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(16)
            make.horizontalEdges.equalToSuperview()
            make.bottom.equalTo(messageTextView.snp.top).offset(-8)
        }
        fileAddButton.snp.makeConstraints { make in
            make.size.equalTo(CGSize(width: ComponentSize.messageTextView.size.height/2, height: ComponentSize.messageTextView.size.height/2))
            make.top.equalTo(chatCollectionView.snp.bottom).offset(ComponentSize.messageTextView.size.height / 4 + 8)
            make.leading.equalToSuperview().offset(16)
        }
        messageTextView.snp.makeConstraints { make in
            make.leading.equalTo(fileAddButton.snp.trailing).offset(12)
            make.trailing.equalToSuperview().offset(-12)
            make.bottom.equalTo(safeArea)
            make.height.equalTo(ComponentSize.messageTextView.size.height)
        }
    }
}
