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
    private lazy var dataSource = RxCollectionViewSectionedAnimatedDataSource<ChatMessageSection> (configureCell: { _, collecitonView, indexPath, item in
        guard let cell = self.chatCollectionView.dequeueReusableCell(withReuseIdentifier: ChatCollectionViewCell.reuseIdentifier, for: indexPath) as? ChatCollectionViewCell else {
            return UICollectionViewCell()
        }
        
        switch item {
        case let .localMessage(message):
            cell.setContent(message)
        case let .unreadMessage(message):
            cell.setContent(message)
        case let .newMessage(message):
            cell.setContent(message)
        }
        
        return cell
    })
    private let messageInputView = UIView().then {
        $0.backgroundColor = .white
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
    
    
    // MARK: - initialize
    
    deinit {
        NotificationCenter.default.removeObserver(self)
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
        reactor.state.map { $0.messages }
            .do(onNext: { [weak self] messages in
                guard let self else { return }
                
                if !messages.isEmpty {
                    let lastSectionIndex = messages.count - 1
                    let lastItemIndex = messages[lastSectionIndex].items.count - 1
                    let lastIndexPath = IndexPath(item: lastItemIndex, section: lastSectionIndex)
                    
                    DispatchQueue.main.async {
                        self.chatCollectionView.scrollToItem(at: lastIndexPath, at: .bottom, animated: true)
                    }
                }
            })
            .bind(to: chatCollectionView.rx.items(dataSource: dataSource))
            .disposed(by: disposeBag)
    }
    
    
    // MARK: - private method
    
    private func setupKeyboardObservers() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(keyboardWillShow(_:)),
            name: UIResponder.keyboardWillShowNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(keyboardWillHide(_:)),
            name: UIResponder.keyboardWillHideNotification,
            object: nil
        )
    }
    
    @objc
    private func keyboardWillShow(_ notification: Notification) {
        guard let userInfo = notification.userInfo,
              let keyboardFrame = userInfo[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect else {
            return
        }
        
        let keyboardHeight = keyboardFrame.height
        
        chatCollectionView.snp.updateConstraints { make in
            make.height.equalTo(ComponentSize.chatBtoomSheet.size.height - ComponentSize.messageTextView.size.height - 28 - keyboardHeight)
        }
        
        view.snp.remakeConstraints { make in
            make.height.equalTo(ComponentSize.chatBtoomSheet.size.height - keyboardHeight)
            make.width.equalTo(self.view.frame.width)
            make.bottom.equalTo(view.keyboardLayoutGuide.snp.top)
        }
        
        self.view.layoutIfNeeded()
    }
    
    @objc
    private func keyboardWillHide(_ notification: Notification) {
        chatCollectionView.snp.remakeConstraints { make in
            make.height.equalTo(ComponentSize.chatBtoomSheet.size.height - ComponentSize.messageTextView.size.height - 28)
            make.top.equalToSuperview().offset(16)
            make.horizontalEdges.equalToSuperview()
        }
        
        view.snp.remakeConstraints { make in
            make.height.equalTo(ComponentSize.chatBtoomSheet.size.height + ComponentSize.safearea.bottom)
            make.width.equalTo(self.view.frame.width)
        }
        
        self.view.layoutIfNeeded()
    }
    
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        [chatCollectionView, messageInputView].forEach {
            view.addSubview($0)
        }
        [fileAddButton, messageTextView].forEach {
            messageInputView.addSubview($0)
        }
    }
    
    override func configureLayout() {
        chatCollectionView.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(16)
            make.horizontalEdges.equalToSuperview()
            make.height.equalTo(ComponentSize.chatBtoomSheet.size.height - ComponentSize.messageTextView.size.height - 28)
        }
        messageInputView.snp.makeConstraints { make in
            make.top.equalTo(chatCollectionView.snp.bottom)
            make.horizontalEdges.equalToSuperview().inset(8)
            make.bottom.equalTo(view.keyboardLayoutGuide.snp.top)
            make.height.equalTo(ComponentSize.messageTextView.size.height)
        }
        fileAddButton.snp.makeConstraints { make in
            make.size.equalTo(CGSize(width: ComponentSize.messageTextView.size.height/2, height: ComponentSize.messageTextView.size.height/2))
            make.top.equalToSuperview().offset(ComponentSize.messageTextView.size.height / 4)
            make.leading.equalToSuperview().offset(12)
        }
        messageTextView.snp.makeConstraints { make in
            make.leading.equalTo(fileAddButton.snp.trailing).offset(12)
            make.trailing.equalToSuperview().offset(-12)
            make.top.equalToSuperview().offset(4)
            make.bottom.equalToSuperview().offset(-4)
            make.height.equalTo(ComponentSize.messageTextView.size.height)
        }
    }
    
    override func configureUI() {
        setupKeyboardObservers()
    }
}
