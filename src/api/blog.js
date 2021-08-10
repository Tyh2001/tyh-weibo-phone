/**
 * 博客相关
 */

import require from '@/utils/require'

/**
 * 上传用户发布的文字内容
 * @param { object } data 文字内容
 * @param { object } params 用户 id 和文字内容
 * @returns
 */
export const onReleaseBlog = (data, params) => {
  return require({
    method: 'POST',
    url: 'index/Blog/releaseBlog',
    data,
    params
  })
}

/**
 * 获取所有的博客内容
 * @returns
 */
export const getAllBlogList = () => {
  return require({
    method: 'GET',
    url: 'index/Blog/getAllBlogList'
  })
}
