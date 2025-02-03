//
//  LightStrokeTextView.swift
//  KickTube
//
//  Created by 김수경 on 1/31/25.
//

import UIKit

final class LightStrokeTextView: UIView {
    private(set) var textView = UITextView().then {
        $0.backgroundColor = .white
        $0.textAlignment = .left
        $0.font = KFont.middle14
    }
    private let placeholderLabel = UILabel().then {
        $0.font = KFont.middle14
        $0.textColor = .kLightgray2
        $0.textAlignment = .left
    }
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
    
    func setPlaceholder(_ text: String) {
        placeholderLabel.text = text
    }
    
    func setAlignment(_ alignment: NSTextAlignment) {
        textView.textAlignment = alignment
    }
    
    func setStyle(_ backgroundColor: UIColor, strokeColor: UIColor? = nil) {
        textView.backgroundColor = backgroundColor
        self.backgroundColor = backgroundColor
        
        if let strokeColor {
            layer.borderWidth = 1
            layer.borderColor = strokeColor.cgColor
        }
    }
    
    
    // MARK: - private method
    
    private func updatePlaceholderVisibility() {
        placeholderLabel.isHidden = !textView.text.isEmpty
    }
    
    
    // MARK: - configure UI
    
    private func configureHierarchy() {
        addSubview(textView)
        textView.addSubview(placeholderLabel)
    }
    
    private func configureLayout() {
        textView.snp.makeConstraints { make in
            make.edges.equalToSuperview().inset(10)
        }
        
        placeholderLabel.snp.makeConstraints { make in
            make.top.equalTo(textView.textContainerInset.top)
            make.leading.equalTo(textView.textContainerInset.left + 6)
            make.trailing.lessThanOrEqualToSuperview().inset(5)
        }
    }
    
    private func configureUI() {
        layer.borderColor = UIColor.kLightgray2.cgColor
        layer.borderWidth = 1
        layer.cornerRadius = 8
        layer.masksToBounds = true
        
        textView.delegate = self
    }
}

extension LightStrokeTextView: UITextViewDelegate {
    func textViewDidChange(_ textView: UITextView) {
        updatePlaceholderVisibility()
    }
    
    func textView(_ textView: UITextView, shouldChangeTextIn range: NSRange, replacementText text: String) -> Bool {
        let currentText = textView.text ?? ""
        guard let stringRange = Range(range, in: currentText) else {
            return false
        }
        let updatedText = currentText.replacingCharacters(in: stringRange, with: text)
        
        return updatedText.count <= maxLength
    }
}
