//
//  UIView+Extensions.swift
//  KickTube
//
//  Created by 김수경 on 2/7/25.
//

import UIKit

extension UIView {
    func roundCorners(_ corners: [UIRectCorner], radius: CGFloat) {
        layer.cornerRadius = 0
        clipsToBounds = true
        layer.cornerRadius = radius
        for corner in corners {
            layer.maskedCorners = CACornerMask(rawValue: corner.rawValue)
        }
    }
}
