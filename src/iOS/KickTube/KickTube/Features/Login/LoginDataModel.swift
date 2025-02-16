//
//  LoginDataModel.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import Foundation

import ManipulateDataModel

// MARK: - 추후 분리 및 위치 변경 예정



struct LoginViewModel {
    var userID: String
    var password: String
    
    var isEmpty: Bool {
        userID == "" && password == ""
    }
}

@EncodeDTO
struct LoginRequestModel {
    let device = "mobile"
}


@DecodeDTO
@ConvertToDomainModel<TokenDomainModel>
struct TokenResponseModel {
    let accessToken: String
    let refreshToken: String
}

struct TokenDomainModel: DTOMappable {
    var accessToken: String
    var refreshToken: String
}

