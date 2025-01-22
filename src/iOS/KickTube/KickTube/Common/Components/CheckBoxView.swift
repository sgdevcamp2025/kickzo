//
//  CheckBoxView.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import UIKit

import RxCocoa
import RxSwift

final class CheckBoxView: UIView {
    private(set) var checkbox = UIButton().then {
        var config = UIButton.Configuration.plain()
        config.image = UIImage(systemName: "square")
        config.baseForegroundColor = .kLightgary
        config.imagePadding = 6
        
        $0.configuration = config
        $0.setPreferredSymbolConfiguration(UIImage.SymbolConfiguration(pointSize: 17), forImageIn: .normal)
    }
    private let content = UILabel()
    
    private(set) var isChecked = BehaviorRelay(value: false)
    var disposeBag = DisposeBag()
    
    init(_ title: String) {
        super.init(frame: .zero)
        
        bind()
        
        setContent(title, KFont.light17)
        
        configureHierarchy()
        configureLayout()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    
    // MARK: - internal method
    
    func setContent(_ text: String?, _ size: UIFont = KFont.light14) {
        content.text = text
        content.font = size
    }
    
    
    // MARK: - private method
    
    private func bind() {
        isChecked
            .asDriver()
            .drive(with: self) { owner, value in
                owner.setImage(value)
            }
            .disposed(by: disposeBag)
    }
    
    private func setImage(_ check: Bool) {
        var config = UIButton.Configuration.plain()
        config.image = UIImage(systemName: isChecked.value == true ? "checkmark.square" : "square")
        config.baseForegroundColor = isChecked.value == true ? .black : UIColor.kLightgary
        config.imagePadding = 6
        
        checkbox.configuration = config
    }
    
    
    // MARK: - configure UI
    
    private func configureHierarchy() {
        addSubview(checkbox)
        addSubview(content)
    }
    
    private func configureLayout() {
        checkbox.snp.makeConstraints { make in
            make.centerY.equalToSuperview()
            make.leading.equalToSuperview()
        }
        content.snp.makeConstraints { make in
            make.centerY.equalToSuperview()
            make.leading.equalTo(checkbox.snp.trailing)
            make.trailing.equalToSuperview()
        }
    }
}
