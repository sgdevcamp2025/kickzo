//
//  RoleButton.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import UIKit

final class RoleButton: UIView {
    private let titleString = UILabel().then {
        $0.text = "권한"
        $0.font = KFont.bold17
        $0.textColor = .white
    }
    private let roleLabel = UILabel().then {
        $0.font = KFont.middle16
    }
    private var role: UserRole
    
    init(_ role: UserRole) {
        self.role = role
        
        super.init(frame: .zero)
        
        configureHierarchy()
        configureLayout()
        configureUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    
    // MARK: - internal method
    
    func setRole(_ role: UserRole) {
        roleLabel.text = role.description
        
        switch role {
        case .creator:
            roleLabel.textColor = .primary
        case .manager:
            roleLabel.textColor = .kGreen
        case .member:
            roleLabel.textColor = .kGray
        default:
            break
        }
    }

    
    // MARK: - Configure UI
    
    private func configureHierarchy() {
        [titleString, roleLabel].forEach {
            addSubview($0)
        }
    }
    
    private func configureLayout() {
        titleString.snp.makeConstraints { make in
            make.leading.equalToSuperview().offset(20)
            make.centerY.equalToSuperview()
        }
        roleLabel.snp.makeConstraints { make in
            make.trailing.equalToSuperview().offset(-20)
            make.centerY.equalToSuperview()
        }
    }
    
    private func configureUI() {
        backgroundColor = UIColor.kDarkgray
        layer.cornerRadius = 8

        setRole(role)
    }
}
