export default  function destructAtr({UserAttributes}){
    let result = {};
    UserAttributes.forEach(({Name,Value})=>{
        result[Name]=Value;
    })
    return result;
}