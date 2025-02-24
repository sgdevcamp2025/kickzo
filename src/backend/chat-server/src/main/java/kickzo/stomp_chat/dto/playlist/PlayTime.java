package kickzo.stomp_chat.dto.playlist;

import java.math.BigDecimal;
import java.math.RoundingMode;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PlayTime {
	private long userId;
	private long roomId;
	private BigDecimal playTime;
	private String playerState;
}
