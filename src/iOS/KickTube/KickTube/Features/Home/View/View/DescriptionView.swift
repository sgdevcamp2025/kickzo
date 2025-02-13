//
//  DescriptionView.swift
//  KickTube
//
//  Created by 김수경 on 2/12/25.
//

import UIKit

final class DescriptionView: UIView {
    private let backgroundView = UIView().then {
        $0.backgroundColor = .kLightgray1
        $0.layer.cornerRadius = 12
    }
    
    private let descriptionLabel = UILabel().then {
        $0.font = KFont.light14
    }
    
    init(_ description: String?) {
        descriptionLabel.text = description
        
        super.init(frame: .zero)
        
        configureHierarchy()
        configureLayout()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Configure UI
    
    private func configureHierarchy() {
        [backgroundView, descriptionLabel].forEach {
            addSubview($0)
        }
    }
    
    private func configureLayout() {
        backgroundView.snp.makeConstraints { make in
            make.top.horizontalEdges.equalToSuperview().inset(12)
            make.bottom.equalTo(descriptionLabel.snp.bottom).offset(12)
        }
        descriptionLabel.snp.makeConstraints { make in
            make.top.horizontalEdges.equalTo(backgroundView).inset(12)
        }
    }
}
