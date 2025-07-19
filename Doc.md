# Documentation !! Yaay let's have some fun

## Routing

Routers are called in order specified in the main router, Clab.Router until one of the called router specifies a response through the connection object with send_resp/3
Specified order should be:
1. Clab.PublicRouter
    Savantly named since it contains all public routes, such as home, login, signup pages and assets (probably shoudln't give open access to ALL assets btw.. @TODO !! :p)

2. Clab.AuthPlug
    Check the token given in the request corresponds to an existing user once decoded, and gives access to user data to further Routers through assigns

3. Clab.ProtectedRouter
    Handles all authentified routes and 404s for now. Don't hesitate to split it in several subrouters if you feel the need.
