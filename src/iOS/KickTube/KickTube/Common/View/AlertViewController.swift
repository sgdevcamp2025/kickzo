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
    
    init(_ alert: AlertMessage) {
        super.init(nibName: nil, bundle: nil)
        
        titleLabel.text = alert.title
        contentsLabel.text = alert.contents
        acceptButton.setTitle(alert.accept)
        cancelButton.setTitle(alert.cancel)
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
        dismiss(animated: true) { [weak self] in
            self?.acceptAction?()
        }
    }
    
    @objc
    private func setCancelButton() {
        dismiss(animated: true) { [weak self] in
            self?.cancelAction?()
        }
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
        
        acceptButton.addTarget(self, action: #selector(setAcceptButton), for: .touchUpInside)
        cancelButton.addTarget(self, action: #selector(setCancelButton), for: .touchUpInside)
    }
}
