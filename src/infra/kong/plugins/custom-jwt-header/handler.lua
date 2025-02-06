local jwt_decoder = require("kong.plugins.jwt.jwt_parser")
local set_header = kong.service.request.set_header

local CustomHandler = {
  VERSION  = "1.0.0",
  PRIORITY = 10,
}

-- Other stuff

function CustomHandler:access(conf)
  -- Retrieve the token from the context
  local token = kong.ctx.shared.authenticated_jwt_token
  if not token then
    kong.log.warn("Token not found in context")

    return kong.response.exit(500, "TEST: Token not found in context")
  end

  local jwt = jwt_decoder:new(token)

	local user_id = jwt.claims.id
	local email = jwt.claims.email
	local role = jwt.claims.role

  if not user_id then
    kong.log.warn("'id' claim not found in JWT")

    return kong.response.exit(500, "TEST: 'sub' claim not found in JWT")
  end

  -- set the header
  set_header("X-User-Id", user_id)
	set_header("X-Email", email)
	set_header("X-Role", role)
end

return CustomHandler
