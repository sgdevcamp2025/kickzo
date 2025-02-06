local typedefs = require "kong.db.schema.typedefs"

return {
  name = "custom-jwt-header",
  fields = {
    { config = {
        type = "record",
        fields = {
    }, }, },
  },
}
