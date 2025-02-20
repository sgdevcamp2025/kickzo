//
//  LoginViewModel.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

struct LoginViewModel {
    var userID: String
    var password: String
    
    var isEmpty: Bool {
        userID == "" && password == ""
    }
}
