module.exports = {
  GET_ALL_PRODUCTS:
  'SELECT cate.name as categoryName, cate.url_logo as logoUrl, prod.name as productName, prod.description as productDescription, prod.is_mall as isMall, prod.is_approve as isApprove, prod.is_checked as isChecked, prod.price as price, prod.quantity as quantity, prod.seen_count as seenCount, prod.bought_count as boughtCount '
  + 'FROM vaynh327_chogame.category cate '
  + 'INNER JOIN vaynh327_chogame.product prod ON cate.code = prod.category_code'
}