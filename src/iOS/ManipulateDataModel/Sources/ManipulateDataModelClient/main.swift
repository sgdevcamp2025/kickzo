import ManipulateDataModel
import Foundation

let a = 17
let b = 25

let (result, code) = #stringify(a + b)

print("The value \(result) was produced by the code \"\(code)\"")

@DecodeDTO
struct TestDTO {
    let test: String
}

@DecodeDTO
struct Model {
    @Key("receiver_id") let receiverID: Int
}


@ConvertToDomainModel<DomainModel>
struct ResponseModel {
    let id: Int
    let name: String
    let createdAt: Date
}


@ConvertToDTOModel<RequestModel>
struct DomainModel: DTOMappable {
    let id: Int
    let name: String
    let createdAt: Date
}


struct RequestModel: DomainMappable {
    let id: Int
    let name: String
    let createdAt: Date
}


let c = ResponseModel(id: 1, name: "sd", createdAt: Date())
var d = c.toModel()
print(d)


