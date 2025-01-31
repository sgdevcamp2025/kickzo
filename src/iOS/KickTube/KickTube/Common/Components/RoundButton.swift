//
//  RoundButton.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import UIKit

final class RoundButton: UIButton {
    private let mainBackgroundColor: UIColor
    private let mainTitleColor: UIColor
    private let toggleBackgroundColor: UIColor?
    private let toggleTitleColor: UIColor?
    
    init(_ title: String, image: UIImage? = nil, bgColor: UIColor = .primary, titleColor: UIColor = .white, toggleBackgroundColor: UIColor? = nil, toggleTitleColor: UIColor? = nil) {
        self.mainBackgroundColor = bgColor
        self.mainTitleColor = titleColor
        self.toggleBackgroundColor = toggleBackgroundColor
        self.toggleTitleColor = toggleTitleColor
        
        super.init(frame: .zero)
        
        var config = UIButton.Configuration.plain()
        
        if let image {
            config.image = image
            config.baseForegroundColor = titleColor
            config.imagePadding = 6
            config.title = title
        }
        
        var titleAttributes = AttributedString(title)
        
        titleAttributes.font = KFont.bold19
        titleAttributes.foregroundColor = titleColor
        
        config.attributedTitle = titleAttributes
        config.background.backgroundColor = bgColor
        config.background.cornerRadius = 15
        
        configuration = config
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
    
    func setStroke(_ color: UIColor, width: CGFloat = 1.0) {
        layer.borderWidth = width
        layer.borderColor = color.cgColor
        layer.cornerRadius = 15
    }
    
    func toggleButtonStatus(_ isDefault: Bool) {
        var config = configuration
        if isDefault {
            config?.baseForegroundColor = mainTitleColor
            config?.background.backgroundColor = mainBackgroundColor
            config?.attributedTitle?.foregroundColor = mainTitleColor
            
            configuration = config
        } else {
            if let tt = toggleTitleColor,
               let tb = toggleBackgroundColor {
                config?.baseForegroundColor = tt
                config?.background.backgroundColor = tb
                config?.attributedTitle?.foregroundColor = tt
                configuration = config
                setStroke(tt)
            }
        }
    }
}
