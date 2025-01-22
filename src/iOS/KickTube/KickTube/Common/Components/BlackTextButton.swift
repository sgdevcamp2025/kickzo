//
//  BlackTextButton.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import UIKit

final class BlackTextButton: UIButton {
    init(_ title: String) {
        super.init(frame: .zero)
        
        setTitle(title, for: .normal)
        titleLabel?.font = KFont.light17
        setTitleColor(.black, for: .normal)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - internal method

    func setStyle(_ font: UIFont) {
        titleLabel?.font = font
    }
}
