let preloadState = [];//管理的全局数据的初始值
//操作购物车数据
//reducer处理全局数据的方法
// 初始化执行，以及之后每一次调用store的dispatch方法reducer都执行一次。
// 调用dispath时提供的参数就作为action传入。
function cartReducer(state = preloadState, action){
    console.log('cart reducer执行了，type:'+action.type);
    if(action.type.includes('redux/INIT')){//初始化执行,初始化购物车数据
      state = JSON.parse(localStorage.getItem('cart')) || [];
      return state;
    }//添加商品到购物车
    else if(action.type === 'add-cart'){
        let index = state.findIndex(item=>{
          return item.id === action.value.id;
        });
        if(index >= 0) {//存在
			let arr = state.map((item, j)=>{
				if(index === j){
					item.count ++;
				}
				return item;
			})//将数据暂时存储起来,以免刷新页面,购物车数据不在了
			localStorage.setItem("cart",JSON.stringify(arr));
			return arr;
        } 
        else {//购物车不存在该商品时
          let data = [ ...state, ...action.value, { count: 1 }];
        	localStorage.setItem("cart",JSON.stringify(data));//sessionStorage的用法一样
          return data;
        }
    }//购物车的商品数量点击+增加
    else if (action.type === "addPro") {
    	let arr = state.map(item=>{
    		if(item.id === action.id) {
					item.count++;
    		}
    		return item;
    	})
    	localStorage.setItem("cart",JSON.stringify(arr));
    	return arr;
    }//购物车的商品数量点击-
    else if (action.type === "reducePro") {
    	let arr = state.map(item=>{
    		if(item.id === action.id) {
    			if(item.count > 2) {
    				item.count --;
    			} else {
    				item.count = 1;
    			}
    		}
    		return item;
    	})
    	localStorage.setItem("cart",JSON.stringify(arr));
    	return arr;
    }//删除操作
    else if (action.type === "deletePro") {
		let arr = state.filter(item=>{
			return item.id !== action.id
		})
        localStorage.setItem("cart",JSON.stringify(arr));
		return arr;
    }
    else{
      return state;
    }
}
// sessionStorage.removeItem(key);
//sessionStorage.setItem(key, JSON.stringify(obj));
//const values = JSON.parse(sessionStorage.getItem(key));
export default cartReducer;