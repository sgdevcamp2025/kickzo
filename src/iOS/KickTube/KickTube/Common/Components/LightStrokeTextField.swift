//
//  LightStrokeTextField.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import UIKit

final class LightStrokeTextField: UIView {
    private(set) var textfield = UITextField()
    private var maxLength: Int
    
    init(frame: CGRect = .zero, maxLength: Int = Int.max) {
        self.maxLength = maxLength
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
    
    func setAlignment(_ alignment: NSTextAlignment) {
        textfield.textAlignment = alignment
    }
    
    func setPWStyle() {
        textfield.isSecureTextEntry = true
    }

    func setStyle(_ backgroundColor: UIColor, strokeColor: UIColor? = nil) {
        textfield.backgroundColor = backgroundColor
        self.backgroundColor = backgroundColor
        
        if let strokeColor {
            layer.borderWidth = 1
            layer.borderColor = strokeColor.cgColor
        }
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
        layer.borderColor = UIColor.kLightgray2.cgColor
        layer.borderWidth = 1
        layer.cornerRadius = 8
        layer.masksToBounds = true
        
        setAlignment(.left)
        
        textfield.delegate = self
    }
}

extension LightStrokeTextField: UITextFieldDelegate {
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        let currentText = textField.text ?? ""
        guard let stringRange = Range(range, in: currentText) else {
            return false
        }
        
        let updatedText = currentText.replacingCharacters(in: stringRange, with: string)
        
        return updatedText.count <= maxLength
    }
}
