//
//  TokenResponseDTO.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

import ManipulateDataModel

@DecodeDTO
@ConvertToDomainModel<TokenDomainModel>
struct TokenResponseModel {
    let accessToken: String
    let refreshToken: String
}
