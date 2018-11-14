//首页图书列表
//https://api.douban.com/v2/book/search
// const BOOK_SEARCH = '/v2/book/search';
const BOOK_SEARCH = '/jsonData/search';

//分类页数据请求,自己写的假数据
const BOOK_CATEGORY_URL = "/jsonData/category";
//获取图书信息https://api.douban.com/v2/book/:id
const BOOK_DETAIL = '/v2/book';
/*
正在上映的请求接口
参数：
    __t：时间戳
    page: 页数
    count：数量
*/
const NOW_PLAYING_URL = '/v4/api/film/now-playing';
//影院接口 参数: __t：时间戳
const CINEMA_LIST_URL = '/v4/api/cinema';
//电影详情页/v4/api/film/4266?__t=1533125954483
const FILM_DETAIL = '/v4/api/film';
//进入影院详情
const CINEMA_DETAIL = '/v4/api/cinema'
export default {
  BOOK_SEARCH,
  BOOK_CATEGORY_URL,
	BOOK_DETAIL,
	NOW_PLAYING_URL,
	CINEMA_LIST_URL,
	FILM_DETAIL,
	CINEMA_DETAIL
}