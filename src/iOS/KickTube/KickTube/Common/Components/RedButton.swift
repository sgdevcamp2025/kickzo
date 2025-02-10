//
//  RedButton.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import UIKit

final class RedButton: UIView {
    private let titleString = UILabel().then {
        $0.font = KFont.bold17
        $0.textColor = .white
    }
    
    init(_ title: String) {
        super.init(frame: .zero)
        
        titleString.text = title
        
        configureHierarchy()
        configureLayout()
        configureUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    
    // MARK: - Configure UI
    
    private func configureHierarchy() {
        [titleString].forEach {
            addSubview($0)
        }
    }
    
    private func configureLayout() {
        titleString.snp.makeConstraints { make in
            make.leading.equalToSuperview().offset(20)
            make.centerY.equalToSuperview()
        }
    }
    
    private func configureUI() {
        backgroundColor = UIColor.red
        layer.cornerRadius = 8
    }
}

