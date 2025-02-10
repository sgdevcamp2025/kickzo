//
//  Reactive+Extensions.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import UIKit

import RxCocoa
import RxSwift

extension Reactive where Base: UIView {
    
    // MARK: - view.isUserInteractionEnabled = true

    var tap: ControlEvent<Void> {
        let tapGesture = UITapGestureRecognizer()
        
        base.addGestureRecognizer(tapGesture)
        base.isUserInteractionEnabled = true

        let source = tapGesture.rx.event
            .map { _ in }
        
        return ControlEvent(events: source)
    }
}
