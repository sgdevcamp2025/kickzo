import SwiftSyntax
import SwiftSyntaxBuilder
import SwiftSyntaxMacros
import SwiftSyntaxMacrosTestSupport
import XCTest

// Macro implementations build for the host, so the corresponding module is not available when cross-compiling. Cross-compiled tests may still make use of the macro itself in end-to-end tests.
#if canImport(ManipulateDataModelMacros)
import ManipulateDataModelMacros

let testMacros: [String: Macro.Type] = [
    "stringify": StringifyMacro.self,
]
#endif

final class ManipulateDataModelTests: XCTestCase {
    func testMacro() throws {
#if canImport(ManipulateDataModelMacros)
        assertMacroExpansion(
            """
            #stringify(a + b)
            """,
            expandedSource: """
            (a + b, "a + b")
            """,
            macros: testMacros
        )
#else
        throw XCTSkip("macros are only supported when running tests for the host platform")
#endif
    }
    
    func testMacroWithStringLiteral() throws {
#if canImport(ManipulateDataModelMacros)
        assertMacroExpansion(
            #"""
            #stringify("Hello, \(name)")
            """#,
            expandedSource: #"""
            ("Hello, \(name)", #""Hello, \(name)""#)
            """#,
            macros: testMacros
        )
#else
        throw XCTSkip("macros are only supported when running tests for the host platform")
#endif
    }
    
    func testMacro_디코딩시_기본_코딩키가_자동으로_생성되는지() throws {
        assertMacroExpansion(
            """
            @DecodeDTO
            struct TestDTO {
                let test: String
            }
            """,
            expandedSource: """
            struct TestDTO {
                let test: String
            
                enum CodingKeys: String, CodingKey {
                    case test
                }
            }
            
            extension TestDTO: Decodable {
            }
            """,
            macros: [
                "DecodeDTO": DTOMacro.self
            ]
        )
    }
    
    func testMacro_인코딩시_기본_코딩키가_자동으로_생성되는지() throws {
        assertMacroExpansion(
            """
            @EncodeDTO
            struct TestDTO {
                let test: String
            }
            """,
            expandedSource: """
            struct TestDTO {
                let test: String
            
                enum CodingKeys: String, CodingKey {
                    case test
                }
            }
            
            extension TestDTO: Encodable {
            }
            """,
            macros: [
                "EncodeDTO": DTOMacro.self
            ]
        )
    }
    
    func testMacro_디코딩시_코딩키가_자동으로_생성되는지() throws {
        assertMacroExpansion(
            """
            @DecodeDTO
            struct TestDTO {
                @Key("test_id") let testId: String
            }
            """,
            expandedSource: """
            struct TestDTO {
                @Key("test_id") let testId: String
            
                enum CodingKeys: String, CodingKey {
                    case testId = "test_id"
                }
            }
            
            extension TestDTO: Decodable {
            }
            """,
            macros: [
                "DecodeDTO": DTOMacro.self
            ]
        )
    }
    
    func testMacro_DTO_에서_DomainModel_로_매핑하는_함수가_생성되는지() throws {
        assertMacroExpansion(
            """
            @ConvertToDomainModel<DomainModel>
            struct ResponseModel {
                let id: Int
                let name: String
                let createdAt: Date
            }
            """,
            expandedSource: """
            struct ResponseModel {
                let id: Int
                let name: String
                let createdAt: Date
            
                func toModel() -> DomainModel {
                    return DomainModel(id: self.id, name: self.name, createdAt: self.createdAt)
                }
            }
            """,
            macros: [
                "ConvertToDomainModel": DataModelMappingMacro.self
            ]
        )
    }
    
    func testMacro_DomainModel_에서_DTO_로_매핑하는_함수가_생성되는지() throws {
        assertMacroExpansion(
            """
            @ConvertToDTOModel<RequestModel>
            struct DomainModel {
                let id: Int
                let name: String
                let createdAt: Date
            }
            """,
            expandedSource: """
            struct DomainModel {
                let id: Int
                let name: String
                let createdAt: Date
            
                func toModel() -> RequestModel {
                    return RequestModel(id: self.id, name: self.name, createdAt: self.createdAt)
                }
            }
            """,
            macros: [
                "ConvertToDTOModel": DataModelMappingMacro.self
            ]
        )
    }    
}
