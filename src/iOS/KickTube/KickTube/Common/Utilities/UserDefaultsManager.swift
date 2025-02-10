//
//  UserDefaultsManager.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import Foundation

final class UserDefaultsManager {
    enum UserDefaultsKey: String {
        case myProfile
        case myRole
    }
    
    static let shared = UserDefaultsManager()
    
    private init() {}
    
    @UserDefaultType(key: UserDefaultsKey.myProfile.rawValue, defaultValue: MyProfileViewModel(userID: -1, email: "", nickname: "비회원"))
    var userProfile: MyProfileViewModel
    
    @UserDefaultType(key: UserDefaultsKey.myRole.rawValue, defaultValue: UserRole.none)
    var myRole: UserRole
}

@propertyWrapper
struct UserDefaultType<T: Codable> {
    let key: String
    let defaultValue: T
    
    init(key: String, defaultValue: T) {
        self.key = key
        self.defaultValue = defaultValue
    }
    
    var wrappedValue: T {
        get {
            guard let data = UserDefaults.standard.data(forKey: key) else {
                return defaultValue
            }
            let decodedValue = try? JSONDecoder().decode(T.self, from: data)
            return decodedValue ?? defaultValue
        }
        set {
            let encodedData = try? JSONEncoder().encode(newValue)
            UserDefaults.standard.setValue(encodedData, forKey: key)
        }
    }
}
