//
//  AlertViewController.swift
//  KickTube
//
//  Created by 김수경 on 1/31/25.
//

import UIKit

import ReactorKit
import RxCocoa
import RxSwift

final class AlertViewController: UIViewController {
    private let popupView = UIView().then {
        $0.backgroundColor = .white
        $0.layer.cornerRadius = 10
    }
    private let titleLabel = UILabel().then {
        $0.font = KFont.bold20
        $0.textColor = .kDarkgray
    }
    private let contentsLabel = UILabel().then {
        $0.font = KFont.middle16
        $0.textColor = .kGray
        $0.numberOfLines = 10
    }
    private let acceptButton = RoundButton("", titleColor: .white)
    private let cancelButton = RoundButton("", bgColor: .white, titleColor: .primary).then {
        $0.setStroke(.kLightgray2)
    }
        
    var acceptAction: (() -> Void)?
    var cancelAction: (() -> Void)?

    private var disposeBag = DisposeBag()
    
    init(_ alert: AlertMessage) {
        super.init(nibName: nil, bundle: nil)
        
        titleLabel.text = alert.title
        if let contents = alert.contents {
            contentsLabel.text = contents
        }
        if let accept = alert.accept {
            acceptButton.setTitle(accept)
        }
        if let cancel = alert.cancel {
            cancelButton.setTitle(cancel)
        }
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        configureHierarchy()
        configureLayout()
        configureUI()
        
        bindAction()
    }
    

    // MARK: - button method
    
    private func bindAction() {
        acceptButton.rx.tap
            .bind(with: self) { owner, _ in
                owner.dismiss(animated: true) {
                    owner.acceptAction?()
                }
            }
            .disposed(by: disposeBag)
        cancelButton.rx.tap
            .bind(with: self) { owner, _ in
                owner.dismiss(animated: true) {
                    owner.cancelAction?()
                }
            }
            .disposed(by: disposeBag)
    }

    
    // MARK: - configure UI
    
    private func configureHierarchy() {
        view.addSubview(popupView)
        [titleLabel, contentsLabel, acceptButton, cancelButton].forEach {
            popupView.addSubview($0)
        }
    }
    
    private func configureLayout() {
        popupView.snp.makeConstraints { make in
            make.center.equalToSuperview()
            make.size.equalTo(ComponentSize.alertModal.size)
        }
        titleLabel.snp.makeConstraints { make in
            make.top.leading.equalToSuperview().inset(20)
        }
        contentsLabel.snp.makeConstraints { make in
            make.top.equalTo(titleLabel.snp.bottom).offset(20)
            make.horizontalEdges.equalToSuperview().inset(20)
        }
        cancelButton.snp.makeConstraints { make in
            make.bottom.equalToSuperview().inset(20)
            make.horizontalEdges.equalToSuperview().inset(20)
            make.height.equalTo(39)
        }
        acceptButton.snp.makeConstraints { make in
            make.bottom.equalTo(cancelButton.snp.top).offset(-16)
            make.horizontalEdges.equalToSuperview().inset(20)
            make.height.equalTo(39)
        }
    }
    
    private func configureUI() {
        view.backgroundColor = UIColor.black.withAlphaComponent(0.5)
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
