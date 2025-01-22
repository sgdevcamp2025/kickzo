//
//  LightStrokeTextField.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import UIKit

final class LightStrokeTextField: UIView {
    private(set) var textfield = UITextField()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        configureHierarchy()
        configureLayout()
        configureUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    
    // MARK: - internal method
    
    func setPlacehodler(_ text: String) {
        textfield.placeholder = text
    }
    
    func setAlighment(_ alignment: NSTextAlignment) {
        textfield.textAlignment = alignment
    }
    
    func setPWStyle() {
        textfield.isSecureTextEntry = true
    }
    
    // MARK: - configure UI
    
    private func configureHierarchy() {
        addSubview(textfield)
    }
    
    private func configureLayout() {
        textfield.snp.makeConstraints { make in
            make.horizontalEdges.equalToSuperview().inset(10)
            make.verticalEdges.equalToSuperview().inset(15)
        }
    }
    
    private func configureUI() {
        layer.borderColor = UIColor.kLightgary.cgColor
        layer.borderWidth = 1
        layer.cornerRadius = 8
        layer.masksToBounds = true
        
        setAlighment(.left)
    }
}
