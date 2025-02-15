package kickzo.stomp_chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDto {
	private Long userId;
	private int role;
	private String nickname;
	private String profileImageUrl;
}
