# PORT's

  API Gateway -> 3000
  User Service -> 3001
  Auth Service -> 3002
  Product Service -> 3003
  Order Service -> 3004
  Cart Service -> 3005


-> On the cart service and on the product srevice i wanted to implement redis in a good way but not planned in the initial state so leaving it how it is for now 

-> Plan is to implement the redis if the get is done then it should try to fetch from the redis cache, and if any other action done like update, add, remove etc., then it should update the redis cache and on the next get it should return the updated value.