//
//  DivideLineView.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import UIKit

final class DivideLineView: UIView {
    init(size: CGSize, color: UIColor) {
        super.init(frame: .zero)
        
        self.snp.makeConstraints { make in
            make.width.equalTo(size.width)
            make.height.equalTo(size.height)
        }
        backgroundColor = color
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
