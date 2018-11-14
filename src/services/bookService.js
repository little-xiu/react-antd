import 'whatwg-fetch'
import API from '../api'
//热映数据请求
export function getTopBookList() {
    return new Promise((resolve,reject)=>{
        fetch(API.NOW_PLAYING_URL,{
           __t: new Date().getTime(),
           page: 1,
           count: 10
        })
        .then(res=>{
            return res.json();
        })
        .then(response=>{
            let result = response.data.films.map(item=>{
                return {
                    id: item.id,
                    img: item.cover.origin,
                    title: item.name,
                    watchCount: item.watchCount,
                    cinemaCount: item.cinemaCount,
                    rating: item.grade,
                    author: item.intro,
                    image: item.poster.origin,//海报图片
                }
            })
            let totalPage = response.data.page.total;
            resolve({
                data: result,
                totalPage
            });
        })
        .catch(err=>{
            console.log(err)
        })
    })
}
//分类 影院接口
export function getCategoryData() {
    return new Promise((resolve,reject)=>{
        fetch(API.CINEMA_LIST_URL,{
            __t: new Date().getTime()
        })
        .then(res=>{
            return res.json();
        })
        .then(result=>{
            let cinemaObj = {}
            result.data.cinemas.map(item=>{
                let name = item.district.name;
                if(!cinemaObj[name]) {
                    cinemaObj[name] = {
                        name: name,
                        data: []
                    };
                }
                cinemaObj[name].data.push(item);
            })//对象转数组好操作
            let arr = Object.keys(cinemaObj).map(key=>{
                return {
                    name: key,
                    show: false,
                    data: cinemaObj[key].data
                }
            })
            resolve(arr)
        })
        .catch(err=>{
            console.log(err)
        })
    })
}
//首页进电影详情页
export function getHomeDetail (id) {
    return new Promise((resolve,reject)=>{
        fetch(`${API.FILM_DETAIL}/${id}/?__t=${new Date().getTime()}`)
        .then(res=>{
            return res.json();
        })
        .then(result=>{
            let film = result.data.film;
            let obj = {
                name: film.name,
                poster: film.poster.origin,
                des: film.synopsis,
                id: film.id
            }
            resolve(obj);
        })
        .catch(err=>{
            console.log(err)
        })
    })
}
//进入影院详情
export function getCinemaDetail (id) {
    return new Promise((resolve,reject)=>{
        fetch(`${API.CINEMA_DETAIL}/${id}/?__t=${new Date().getTime()}`)
        .then(res=>{
            return res.json();
        })
        .then(result=>{
            let data = result.data.cinema;
            let obj = {
                id: data.id,
                name: data.name,
                ptelephones: data.telephones,
                address: data.address
            }
            resolve(obj)
        })
        .catch(err=>{
            console.log(err);
        })
    })
}



//转换价格的格式
// let convertPrice = function(price) {
//     let tmp = "";
//     for (let i = 0; i < price.length; i++) {
//         if(price[i] === ".") {
//             tmp += price[i];
//         } else if (isNaN(Number(price[i]))) {
//             continue;
//         } else {
//             tmp += price[i];
//         }
//     }
//     return tmp;
// }
// //转换数组作者的名字为字符串,
// let convertAuthor = function(arr) {
//     let tmp = "";
//     for (let i = 0; i < arr.length; i++) {
//         tmp += arr[i];
//         if (i !== arr.length -1) {
//             tmp += ", ";
//         }
//     }
//     return tmp;
// }
// // 请求首页数据的方法
// export function getTopBookList(){
//     return new Promise((resolve, reject)=>{
//         // console.log('请求');
//         fetch(`${API.BOOK_SEARCH}?q=推荐`)
//         .then(response=>{
//             // console.log('请求得到响应');
//             return response.json();
//         })
//         .then(result=>{
//             // console.log('请求接收数据完成');
//             let data = result.books.map(book=>{
//                 return {
//                     id: book.id,
//                     title: book.title,
//                     price: convertPrice(book.price),
//                     image: book.images.large,
//                     rating: book.rating.average,
//                     author: convertAuthor(book.author)
//                 }
//             })
//             resolve(data);
//         })
//         .catch((err)=>{
//             console.log('请求首页数据失败');
//         })
//     })
// }
//分类页数据请求  
// export function getCategoryData() {
//     return new Promise((resolve,reject)=>{
//         fetch(API.BOOK_CATEGORY_URL)
//         .then(res=>{
//             return res.json();
//         })
//         .then(result=>{
//             let data = result.map(item=>{
//                 item.isShow = false;
//                 item.subItem = item["sub-item"];
//                 return item;
//             })
//             resolve(data);
//         })
//         .catch((err)=>{
//             console.log("请求分类失败");
//         })
//     })
// }
