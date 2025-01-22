//
//  TabBarViewController.swift
//  KickTube
//
//  Created by 김수경 on 1/20/25.
//

import UIKit

final class TabBarViewController: UITabBarController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let nav1VC = UIViewController()
        let nav2VC = UIViewController()
        let nav3VC = UIViewController()
        let nav4VC = UIViewController()
        let nav5VC = LoginViewController(LoginReactor())
        
        let nav1 = UINavigationController(rootViewController: nav1VC)
        nav1.tabBarItem = UITabBarItem(title: nil, image: UIImage.playlist.resize(to: CGSize(width: ComponentSize.navigationItem.size.width, height: ComponentSize.navigationItem.size.height)), tag: 0)
        
        let nav2 = UINavigationController(rootViewController: nav2VC)
        nav2.tabBarItem = UITabBarItem(title: nil, image: UIImage.friend.resize(to: CGSize(width: ComponentSize.navigationItem.size.width, height: ComponentSize.navigationItem.size.height)), tag: 1)
        
        let nav3 = UINavigationController(rootViewController: nav3VC)
        nav3.tabBarItem = UITabBarItem(title: nil, image: UIImage.home.resize(to: CGSize(width: ComponentSize.navigationItem.size.width, height: ComponentSize.navigationItem.size.height)), tag: 2)
        
        let nav4 = UINavigationController(rootViewController: nav4VC)
        nav4.tabBarItem = UITabBarItem(title: nil, image: UIImage.notification.resize(to: CGSize(width: ComponentSize.screenWidth / 15, height: ComponentSize.screenWidth / 15)), tag: 3)
        
        let nav5 = UINavigationController(rootViewController: nav5VC)
        nav5.tabBarItem = UITabBarItem(title: nil, image: UIImage.profile.resize(to: CGSize(width: ComponentSize.navigationItem.size.width, height: ComponentSize.navigationItem.size.height)), tag: 4)
        
        setViewControllers([nav1, nav2, nav3, nav4, nav5], animated: false)
        
        selectedIndex = 4
        tabBar.tintColor = .primary
    }
}
