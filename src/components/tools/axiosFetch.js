import axios from "axios";
const BACKEND_URL = "http://localhost:5000"
const Fetch = axios.create({
    baseURL:BACKEND_URL,    
})
function setupConfigImg(){
    return{
        headers:{Authorization:'Bearer '+localStorage.getItem("access_token"),'content-type': 'multipart/form-data'}
    }
}
function setupConfig(){
    return {
        headers:{Authorization:'Bearer '+localStorage.getItem("access_token")}
    }
}
export async function checkUserEmail({email}){
    return Fetch.get("/auth/check_email_exist/"+email);
}
export async function saveUserAndSendCodeVerify({email,username,password}){
    return Fetch.post("/auth/sign_up",{Email:email,Username:username,Password:password});
}
export async function sendCodeVerifyAgain({username}){
    return Fetch.post("/auth/resend_confirm_code",{Username:username});
}
export async function checkCodeVerify({username,verify_code}){
    return Fetch.patch("/auth/confirm_email",{Username:username,Code:verify_code});
}
export async function sendForgotPassCode({username}){
    return Fetch.post("auth/change_password",{Username:username});
}
export async function checkForgotPassCode({username,passsword,code}){
    return Fetch.post("auth/confirm_change_password",{Username:username,Password:passsword,Code:code});
}
export async function signIn({username,passsword}){
    return Fetch.post("auth/sign_in",{Username:username,Password:passsword});
}
export async function getAccessToken(){
    return Fetch.post("auth/access_token",{RefreshToken:localStorage.getItem("refresh_token")});
}
export async function getProductById({product_id=-1}){
    return Fetch.get("product/"+product_id);
}
export function getProductsByUserId({user_id,amount,page}){
    return Fetch.get("product/user/"+user_id,{params:{Amount:amount,Page:page}});
}
export function getProducts({name_search,amount,page}){
    return Fetch.get("product",{params:{Amount:amount,Page:page,Search:name_search}});
}
//require access token start from this fectch
export async function getUserInfo(){
    return fecthData(()=>Fetch.get("user",setupConfig()));
}
export async function postProduct({product_name,product_describe,product_price,product_discount,product_quantity}){
    const product_info = {
        ProductName:product_name,
        ProductDescribe:product_describe,
        ProductPrice:product_price,
        ProductDiscount:product_discount,
        ProductQuanity:product_quantity,
    }
    return fecthData(()=>Fetch.post("product",product_info,setupConfig()));
}
export async function deleteProduct({product_id}){
    return fecthData(()=>Fetch.delete("product/"+product_id,setupConfig()));
}
export async function postImg({img_file,product_id=-1}){
    const form_data = new FormData();
    form_data.append('file',img_file);
    return fecthData(()=>Fetch.post("product/image/"+product_id,form_data,setupConfigImg()));
}
export async function updateUserInfo(info){
    return fecthData(()=>Fetch.patch("user",{...info},setupConfig()));
}
export async function updateProduct({product_name,product_describe,product_discount,product_price,product_quantity,product_id = -1}){
    const product_info = {
        ProductName:product_name,
        ProductDescribe:product_describe,
        ProductDiscount:product_discount,
        ProductPrice:product_price*100,
        ProductQuantity:product_quantity,
        ProductId:product_id
    }
    console.table(product_info)
    return fecthData(()=>Fetch.patch("product",product_info,setupConfig()))
}
//create ability to request a new access token when the old one is expired. After that, refect the data with a new token 
async function fecthData(funct){
    try{
        const result = funct();
        return result;
    }catch(err){
        const data = await getAccessToken();
        const access_token = data.data.AuthenticationResult?.AccessToken;
        localStorage.setItem("access_token",access_token);
        const result = funct();
        return result;
    }
}
