//
//  LoginViewController.swift
//  KickTube
//
//  Created by 김수경 on 1/21/25.
//

import UIKit

import SnapKit
import ReactorKit
import RxCocoa
import RxSwift

final class LoginViewController: BaseViewController<LoginReactor> {
    private let logoImageView = UIImageView().then {
        $0.image = UIImage.logo
    }
    private let loginLabel = UILabel().then {
        $0.text = "로그인 후 킥튜브를 즐겨보세요 :)"
        $0.font = KFont.middle18
    }
    private let loginStackView = UIStackView().then {
        $0.axis = .vertical
        $0.distribution = .fillEqually
        $0.spacing = 10
    }
    private let idTextField = LightStrokeTextField().then {
        $0.setPlacehodler("아이디")
    }
    private let pwTextField = LightStrokeTextField().then {
        $0.setPlacehodler("비밀번호")
        $0.setPWStyle()
    }
    private let saveIDCheckBox = CheckBoxView("아이디 저장")
    private let loginButton = RoundButton("로그인")
    private let optionStackView = UIStackView().then {
        $0.axis = .horizontal
        $0.distribution = .fillProportionally
        $0.spacing = 10
    }
    private let registerButton = BlackTextButton("회원가입")
    private let pwResettingButton = BlackTextButton("비밀번호 재설정")
    private let divideView = DivideLineView(size: CGSize(width: 1.0, height: 8.0), color: UIColor.kLightgary)
    
    override func viewWillAppear(_ animated: Bool) {
        navigationController?.setNavigationBarHidden(true, animated: animated)
    }
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        [logoImageView, loginLabel, loginStackView, saveIDCheckBox, loginButton, optionStackView].forEach {
            view.addSubview($0)
        }
        [idTextField, pwTextField].forEach {
            loginStackView.addArrangedSubview($0)
        }
        [registerButton, divideView, pwResettingButton].forEach {
            optionStackView.addArrangedSubview($0)
        }
    }
    
    override func configureLayout() {
        logoImageView.snp.makeConstraints { make in
            make.centerX.equalToSuperview()
            make.top.equalToSuperview().offset(120)
        }
        loginLabel.snp.makeConstraints { make in
            make.centerX.equalToSuperview()
            make.top.equalTo(logoImageView.snp.bottom).offset(30)
        }
        loginStackView.snp.makeConstraints { make in
            make.centerX.equalToSuperview()
            make.top.equalTo(loginLabel.snp.bottom).offset(30)
            make.horizontalEdges.equalToSuperview().inset(50)
        }
        idTextField.snp.makeConstraints { make in
            make.height.equalTo(49)
        }
        pwTextField.snp.makeConstraints { make in
            make.height.equalTo(49)
        }
        saveIDCheckBox.snp.makeConstraints { make in
            make.top.equalTo(loginStackView.snp.bottom).offset(20)
            make.centerX.equalToSuperview()
            make.height.equalTo(saveIDCheckBox.checkbox.snp.height)
        }
        loginButton.snp.makeConstraints { make in
            make.centerX.equalToSuperview()
            make.top.equalTo(saveIDCheckBox.snp.bottom).offset(30)
            make.horizontalEdges.equalToSuperview().inset(50)
            make.height.equalTo(49)
        }
        optionStackView.snp.makeConstraints { make in
            make.centerX.equalToSuperview()
            make.top.equalTo(loginButton.snp.bottom).offset(30)
        }
    }
    
    
    // MARK: - configure Reactor
    
    override func bindAction(reactor: LoginReactor) {
        saveIDCheckBox.checkbox.rx.tap
            .map { Reactor.Action.saveIDButtonTap }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        idTextField.textfield.rx.text
            .orEmpty
            .distinctUntilChanged()
            .map { Reactor.Action.setIDText($0) }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        pwTextField.textfield.rx.text
            .orEmpty
            .distinctUntilChanged()
            .map { Reactor.Action.setIDText($0) }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        loginButton.rx.tap
            .map { Reactor.Action.loginButtonTap }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
    }
    
    override func bindState(reactor: LoginReactor) {
        super.bindAction(reactor: reactor)
        
        reactor.state.map { $0.isIDSave }
            .bind(to: saveIDCheckBox.isChecked)
            .disposed(by: disposeBag)
    }
}
