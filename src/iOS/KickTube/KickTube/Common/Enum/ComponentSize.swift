//
//  ComponentSize.swift
//  KickTube
//
//  Created by 김수경 on 1/20/25.
//

import UIKit

enum ComponentSize {
    static var screenWidth: CGFloat {
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
            return windowScene.screen.bounds.size.width
        }
        return UIScreen.main.bounds.size.width
    }
    static var screenHeight: CGFloat {
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
            return windowScene.screen.bounds.size.height
        }
        return UIScreen.main.bounds.size.height
    }
    
    case navigationItem
    case alarmNavigtionItem
    case homeCollectionViewCell
    case homeProfileImage
    case createRoomModal
}

extension ComponentSize {
    var size: CGSize {
        switch self {
        case .navigationItem:
            return CGSize(width: ComponentSize.screenWidth / 17, height: ComponentSize.screenWidth / 17)
        case .alarmNavigtionItem:
            return CGSize(width: ComponentSize.screenWidth / 15, height: ComponentSize.screenWidth / 15)
        case .homeCollectionViewCell:
            return CGSize(width: ComponentSize.screenWidth - 24, height: (ComponentSize.screenWidth - 24) * 9 / 16 + 90)
        case .homeProfileImage:
            return CGSize(width: ComponentSize.homeCollectionViewCell.size.width / 10, height: ComponentSize.homeCollectionViewCell.size.width / 10)
        case .createRoomModal:
            if ComponentSize.screenHeight <= 667 {
                return CGSize(width: ComponentSize.screenWidth / 4 * 3.5, height: ComponentSize.screenHeight / 7 * 5.5)
            }
            return CGSize(width: ComponentSize.screenWidth / 4 * 3, height: ComponentSize.screenHeight / 7 * 4)
        }
    }
    
    var radius: CGFloat {
        switch self {
        case .homeProfileImage:
            return ComponentSize.homeProfileImage.size.width * 2 / 9
        default:
            return 0
        }
    }
}
