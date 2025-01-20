//
//  DTOToDomainModelMacro.swift
//  DataModelMappingMacro
//
//  Created by 김수경 on 1/16/25.
//

import SwiftSyntax
import SwiftSyntaxBuilder
import SwiftSyntaxMacros

public struct DataModelMappingMacro {}

extension DataModelMappingMacro: MemberMacro {
    public static func expansion(
        of attribute: AttributeSyntax,
        providingMembersOf declaration: some DeclGroupSyntax,
        in context: some MacroExpansionContext
    ) throws -> [DeclSyntax] {
        guard let returnModelType = attribute.attributeName.as(IdentifierTypeSyntax.self)?
            .genericArgumentClause?
            .arguments.first?
            .argument else {
            return []
        }
        
        guard let structDecl = declaration.as(StructDeclSyntax.self) else {
            return []
        }
        
        let members = structDecl.memberBlock.members
        let variableDecls = members.compactMap { $0.decl.as(VariableDeclSyntax.self) }
        let variables = variableDecls.compactMap { variableDecl -> (String, String)? in
            guard let binding = variableDecl.bindings.first else {
                return nil
            }
            
            let name = binding.pattern.description.trimmingCharacters(in: .whitespacesAndNewlines)
            let type = binding.typeAnnotation?.description ?? ""
            
            return (name, type)
        }
        
        let initializer = try FunctionDeclSyntax("func toModel() -> \(returnModelType)") {
            CodeBlockItemListSyntax {
                let returnExpression =  ExprSyntax("\(returnModelType)(\(raw: variables.map { "\($0.0): self.\($0.0)" }.joined(separator: ", ")))")
                
                CodeBlockItemSyntax(item: .stmt(StmtSyntax(ReturnStmtSyntax(expression: returnExpression))))
            }
        }
        
        return [DeclSyntax(initializer)]
    }
}
