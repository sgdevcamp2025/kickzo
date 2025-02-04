//
//  ReuseIdentifiable.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import UIKit

protocol ReuseIdentifiable {
    static var reuseIdentifier: String { get }
}

extension ReuseIdentifiable {
    static var reuseIdentifier: String {
        return String(describing: self)
    }
}

extension UICollectionReusableView: ReuseIdentifiable {}
