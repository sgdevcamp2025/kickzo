//
//  RoundButton.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import UIKit

final class RoundButton: UIButton {
    init(_ title: String, bgColor: UIColor = .primary, titleColor: UIColor = .white) {
        super.init(frame: .zero)
        
        setTitle(title, for: .normal)
        titleLabel?.font = KFont.bold19
        setTitleColor(titleColor, for: .normal)
        backgroundColor = bgColor
        layer.cornerRadius = 10
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    
    // MARK: - internal method
    
    func setInactive(_ bgColor: UIColor = .lightGray) {
        backgroundColor = bgColor
        isUserInteractionEnabled = false
    }
    
    func setActive(_ bgColor: UIColor = .primary) {
        backgroundColor = bgColor
        isUserInteractionEnabled = true
    }
    
    func setStyle(_ font: UIFont) {
        titleLabel?.font = font
    }
}
