class APiUtils
{
    constructor(apiContext,loginPayLoad)
    {
        this.apiContext =apiContext; 
        this.loginPayLoad = loginPayLoad;
    }

    async getToken()
    {
        try{
            const loginResponse =  await  this.apiContext.post("https://rahulshettyacademy.com/ecom/auth/login",{
                data:this.loginPayLoad
            })//200,201,
            const loginResponseJson = await loginResponse.json();
            const token =loginResponseJson.token;
            console.log(token);
            return token;
        } catch (err) {
            console.error('getToken failed:', err);
            throw err; // rethrow to fail the test
        }  
    }

    async createOrder(orderPayLoad)
    {
        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data : orderPayLoad,
            headers:{
                'Authorization' :response.token,
                'Content-Type'  : 'application/json'
            },

        })
        const orderResponseJson =await orderResponse.json();
        console.log(orderResponseJson);
        const orderId = orderResponseJson.orders[0];
        response.orderId = orderId;

        return response;
    }
    async getOrdersForCustomer(token, clientId) {
        const response = await this.apiContext.get(
            `https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/${clientId}`,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
        const responseJson = await response.json();
        console.log(responseJson);
        return responseJson;
    }
    async getTokenAndClientId() {
        const loginResponse = await this.apiContext.post(
            "https://rahulshettyacademy.com/api/ecom/auth/login",
            { data: this.loginPayLoad }
        );
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        const clientId = loginResponseJson.userId || loginResponseJson.id || loginResponseJson._id; // adjust key as needed
        console.log('Token:', token, 'ClientId:', clientId);
        return { token, clientId };
    }
}
module.exports = {APiUtils};




