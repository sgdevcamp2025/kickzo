package com.kickzo.main.enums;

public enum InvitationStatus {
	PENDING,
	ACCEPTED,
	REJECTED;

	@Override
	public String toString() {
		return name().toLowerCase();
	}
}
