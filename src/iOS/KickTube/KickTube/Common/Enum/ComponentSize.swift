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
    static var safearea: UIEdgeInsets {
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let safearea = windowScene.keyWindow?.safeAreaInsets {
            return safearea
        }
        return UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
    }
    
    case navigationItem
    case alarmNavigtionItem
    case homeCollectionViewCell
    case roomCollectionViewCell
    case homeProfileImage
    case createRoomModal
    case alertModal
    case optionButton
    case youtubePlayer
    case userCollectionViewCell
    case userOverviewProfileImage
    case userlistBottomSheet
    case chatBottomSheet
    case messageTextView
    
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
        case .roomCollectionViewCell:
            return CGSize(width: ComponentSize.screenWidth - 24, height: (ComponentSize.screenWidth - 24) / 7 * 2)
        case .homeProfileImage:
            return CGSize(width: ComponentSize.homeCollectionViewCell.size.width / 10, height: ComponentSize.homeCollectionViewCell.size.width / 10)
        case .createRoomModal:
            if ComponentSize.screenHeight <= 667 {
                return CGSize(width: ComponentSize.screenWidth / 4 * 3.5, height: ComponentSize.screenHeight / 7 * 5.5)
            }
            return CGSize(width: ComponentSize.screenWidth / 4 * 3, height: ComponentSize.screenHeight / 7 * 4)
        case .alertModal:
            if ComponentSize.screenHeight <= 667 {
                return CGSize(width: ComponentSize.screenWidth / 4 * 3.5, height: ComponentSize.screenHeight / 7 * 3)
            }
            return CGSize(width: ComponentSize.screenWidth / 4 * 3, height: ComponentSize.screenHeight / 7 * 2.2)
        case .optionButton:
            return CGSize(width: ComponentSize.screenWidth - 24, height: 48)
        case .youtubePlayer:
            return CGSize(width: ComponentSize.screenWidth, height: ComponentSize.screenWidth / 16 * 9)
        case .userCollectionViewCell:
            return CGSize(width: ComponentSize.screenWidth - 40, height: (ComponentSize.screenWidth - 40) / 7)
        case .userOverviewProfileImage:
            return CGSize(width: ComponentSize.screenWidth / 5, height: ComponentSize.screenWidth / 5)
        case .userlistBottomSheet:
            if ComponentSize.screenHeight <= 667 {
                return CGSize(width: ComponentSize.screenWidth, height: ComponentSize.screenHeight / 5 * 2)
            }
            return CGSize(width: ComponentSize.screenWidth, height: ComponentSize.screenHeight / 3)
        case .chatBottomSheet:
            return CGSize(width: ComponentSize.screenWidth, height: ComponentSize.screenHeight - ComponentSize.safearea.top - ComponentSize.safearea.bottom - ComponentSize.youtubePlayer.size.height)
        case .messageTextView:
            return CGSize(width: 0, height: 48)
        }
    }
    
    var radius: CGFloat {
        switch self {
        case .homeProfileImage:
            return ComponentSize.homeProfileImage.size.width * 2 / 9
        case .optionButton:
            return 12
        default:
            return 0
        }
    }
}
