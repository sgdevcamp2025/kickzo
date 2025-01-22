//
//  LoginDataModel.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import Foundation

import ManipulateDataModel

// MARK: - 추후 분리 및 위치 변경 예정


@EncodeDTO
struct LoginRequestModel: DomainMappable {
    let id: String
    let pw: String
}

@ConvertToDTOModel<LoginRequestModel>
struct LoginDomainModel {
    var id: String
    var pw: String
}

struct LoginViewModel {
    var id: String?
    var pw: String?
    
    func toModel() -> LoginDomainModel? {
        if let id, let pw {
            return .init(id: id, pw: pw)
        }
        
        return nil
    }
}
